from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Movie
import ast
from django.core.cache import cache

def create_soup(x):
    soup = ''
    if x.genres != '':
        soup += ' '.join(ast.literal_eval(x.genres)) + ' '
    if x.director != '':
        soup += ' '.join(ast.literal_eval(x.director)) + ' '
    if x.writer != '':
        soup += ' '.join(ast.literal_eval(x.writer)) + ' '
    if x.plot_keywords != '':
        soup += ' '.join(ast.literal_eval(x.plot_keywords))
    return soup

def getCountVector(data):
    count = CountVectorizer(stop_words='english')
    return count.fit_transform(data)

def getRecommendations(movie_name, topn, similarity_matrix, movie_list):
    nonzero_index = []
    row = movie_list.index(movie_name)
    for i in range(len(similarity_matrix[row])):
        if similarity_matrix[row][i] != 0:
            nonzero_index.append(i)
    nonzero_index = sorted(nonzero_index, key = lambda x:similarity_matrix[row][x], reverse=True)
    similar_movies = []
    for i in nonzero_index[1:topn]:
        similar_movies.append(movie_list[i])
    return similar_movies

def getSimilar(movie_id):
    movie_data = Movie.objects.all().only("director", "writer", "plot_keywords", "genres")
    movie_names = list(Movie.objects.values_list("title", flat=True))
    movie_soup = []
    for movie in movie_data:
        movie_soup.append(create_soup(movie))
    movie_name = list(Movie.objects.filter(movie_id=movie_id).values_list("title", flat=True))[0]

    if cache.get('count_matrix') == None:
        count_matrix = getCountVector(movie_soup)
        cache.set('count_matrix', count_matrix)
    else:
        count_matrix = cache.get('count_matrix')

    if cache.get('similarity_matrix') == None:
        similarity_matrix = cosine_similarity(count_matrix, count_matrix)
        cache.set('similarity_matrix', similarity_matrix)
    else:
        similarity_matrix = cache.get('similarity_matrix')

    similar_movie_names = getRecommendations(movie_name, 11, similarity_matrix, movie_names)
    similar_movie_data = list(Movie.objects.filter(title__in=similar_movie_names).values_list("movie_id", "title", "poster_path", "runtime", "release_year"))
    return similar_movie_data

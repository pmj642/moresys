from django.shortcuts import render
from .models import Movie

def movie_detail(request, movie_id):
    from .recommender import getSimilar
    similar_movies = getSimilar(movie_id)
    return render(request, 'moresysapp/movie_detail.html', {'movie_id': movie_id, 'similar_movies': similar_movies})

from django.shortcuts import render
from .models import Movie
import json

def home(request):
    top_10_movies = Movie.objects.all().only("movie_id", "title", "poster_path", "runtime", "release_year").values()[:12]
    return render(request, 'moresysapp/movie_list.html', {'movies': top_10_movies})

def search(request, query):
    search_results = Movie.objects.filter(title__contains=query).only("movie_id", "title", "poster_path", "runtime", "release_year").values()
    return render(request, 'moresysapp/movie_list.html', {'movies': search_results})

def movie_detail(request, movie_id):
    from .recommender import getSimilar
    movie = Movie.objects.filter(movie_id=movie_id).only("movie_id", "title", "poster_path", "runtime", "release_year", "genres", "overview", "director", "writer").values()[0]
    similar_movies = getSimilar(movie_id)
    return render(request, 'moresysapp/movie_detail.html', {'movie': movie, 'similar_movies': similar_movies[:6]})

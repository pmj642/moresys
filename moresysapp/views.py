from django.shortcuts import render
from .models import Movie
import json

def home(request):
    top_10_movies = Movie.objects.all().only("movie_id", "title", "poster_path", "runtime", "release_year").values()[:10]
    return render(request, 'moresysapp/movie_list.html', {'movies': top_10_movies})

def movie_detail(request, movie_id):
    from .recommender import getSimilar
    similar_movies = getSimilar(movie_id)
    return render(request, 'moresysapp/movie_detail.html', {'movie_id': movie_id, 'similar_movies': similar_movies})

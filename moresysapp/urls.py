from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('search/<query>/', views.search, name='search'),
    path('movie/<int:movie_id>/', views.movie_detail, name='movie_detail'),
]

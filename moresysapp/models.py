from django.conf import settings
from django.db import models
from django.utils import timezone


class Movie(models.Model):
    movie_id = models.PositiveIntegerField(primary_key=True)
    title = models.CharField(max_length=200)
    genres = models.CharField(max_length=100, default='')
    poster_path = models.CharField(max_length=200, default='')
    overview = models.TextField(default='')
    cast = models.TextField(default='')
    director = models.TextField(default='')
    writer = models.TextField(default='')
    release_year = models.TextField(default='')
    runtime = models.FloatField()
    plot_keywords = models.TextField(default='')

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

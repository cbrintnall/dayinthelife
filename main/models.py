from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Album(models.Model):
    album_title = models.CharField(max_length=64)
    album_description = models.CharField(max_length=64)
    owner = models.OneToOneField(get_user_model())

class Photo(models.Model):
    photo_time = models.IntegerField()
    photo_location = models.CharField(max_length=64)
    photo_album = models.OneToOneField(
        Album,
        on_delete=models.CASCADE,
        related_name='photo_album',
    )

class Tags(models.Model):
    tag_name = models.CharField(max_length=64)
    tag_albums = models.ManyToManyField(Album)
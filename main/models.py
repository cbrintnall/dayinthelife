from django.db import models
from django.contrib.auth import get_user_model

"""
    Models for ThroughTheEyeOf Website

    All strings have a limit of 64 characters
    unless otherwise specified
"""

class Album(models.Model):
    """
    Contains:
        * album_title - String containing the name of the album
        * album_description - Description of the album
        * album_owner - Reference to the User Object who 'owns' this album
    """
    album_title = models.CharField(max_length=64)
    album_description = models.CharField(max_length=64)
    album_owner = models.OneToOneField(get_user_model())

class Photo(models.Model):
    """
    Contains:
        * photo_time - Integer time of the photo taken
            Example: 2:34pm is stored as 1434 military time
        * photo_location - String name of location of where photo was taken
        * photo_album - Foreign Key Reference to the Album Model 
            that 'owns' the photo
    """
    photo_time = models.IntegerField()
    photo_location = models.CharField(max_length=64)
    photo_album = models.OneToOneField(
        Album,
        on_delete=models.CASCADE,
        related_name='photo_album',
    )

class Tags(models.Model):
    """
    Contains:
        tag_name - String representation of the tag,
        tag_albums = Foreign Key Reference to the Album Models that
            are tagged with this tag
    """
    tag_name = models.CharField(max_length=64)
    tag_albums = models.ManyToManyField(Album)

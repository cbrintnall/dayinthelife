from django.urls import path

from . import views as view
import api

urlpatterns = [
	path('', view.index),
	path('home/', view.home),
	path('api/', api.get_photos)
]
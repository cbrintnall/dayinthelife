from django.urls import path

from . import views as view

urlpatterns = [
	path('', view.index),
	path('test/', view.test),
]
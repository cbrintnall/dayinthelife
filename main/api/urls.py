from django.urls import path

import main.api.views as views

urlpatterns = [
	path('public/', views.get_photos),
]
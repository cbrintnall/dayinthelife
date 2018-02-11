from django.urls import path, include

import main.api.views as views

urlpatterns = [
	path('public/', views.get_photos),
	path('file/', include('django_fine_uploader.urls')),
]
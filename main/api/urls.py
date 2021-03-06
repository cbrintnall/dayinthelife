from django.urls import path, include

import main.api.views as views

urlpatterns = [
	path('public/', views.get_photos),
	path('file/', include('django_fine_uploader.urls')),
	path('album/', views.create_album),
	path('photo/<int:album_id>/', views.add_photo),
	path('close_album/<int:album_id>/', views.close_album)
]
from django.urls import path, include
import main.views as view

urlpatterns = [
	path('', view.home),
	path('api/', include('main.api.urls')),
	path('upload/', view.upload),
	path('profile/', view.profile),
	path('profile/edit/', view.edit_profile),
	path('album/<int:album_id>/', view.album),
]
from django.urls import path, include
import main.views as view

urlpatterns = [
	path('', view.home),
	path('api/', include('main.api.urls')),
	path('upload/', view.upload),
	path('tiles/', view.tiles),
	path('profile/', view.profile),
]
from django.urls import path, include

import main.views as view

urlpatterns = [
	path('', view.index),
	path('home/', view.home),
	path('api/', include('main.api.urls')),
]
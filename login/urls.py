from django.urls import path, include

from . import views

#Directs to respective HTML render views
urlpatterns = [
	path('login/', views.login),
	path('register/', views.register)
]

#Redirects all api/ to the api urls.
urlpatterns += [
	path('api/', include('login.api.urls'))
]
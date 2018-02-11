from django.urls import path

from . import views

#Dispatch urls to auth endpoints
urlpatterns = [
	path('login/', views.login),
	path('logout/', views.logout),
	path('register/', views.register)
]
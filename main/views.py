from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import Http404
from login.models import UserInfo
from main.models import Album, Photo
from pytz import all_timezones

def index(request):
	context = {}
	return render(request, 'index.html', context)

def home(request):
	context = {} 
	return render(request, 'home.html', context)

@login_required
def upload(request):
	context = {}
	context['timezones'] = all_timezones
	return render(request, 'upload.html', context)

@login_required 
def profile(request):
	userid = request.user.id
	query_results = UserInfo.objects.get(user=userid)
	context = {'UserInfo': query_results} 
	return render(request, 'profile.html', context)

@login_required
def edit_profile(request):
	userid = request.user.id 
	query_results = UserInfo.objects.get(user=userid)
	context = {'UserInfo': query_results}
	return render(request, 'edit_profile.html', context)
	
def tiles(request):
	context = {}
	return render(request, 'tiles.html', context)

def album(request, album_id):
	context = {}

	album = Album.objects.filter(pk=album_id)

	if album.exists():
		context['album'] = Album.objects.get(pk=album_id)
		return render(request, 'album.html', context)

	raise Http404("Album does not exist")

	
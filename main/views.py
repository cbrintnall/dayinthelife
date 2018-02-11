from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from login.models import UserInfo

def index(request):
	context = {}
	return render(request, 'index.html', context)

def home(request):
	context = {} 
	return render(request, 'home.html', context)

@login_required
def upload(request):
	context = {}
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
	
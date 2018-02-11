from django.shortcuts import render
from django.contrib.auth.decorators import login_required

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
	context = {} 
	return render(request, 'profile.html', context)
	
def tiles(request):
	context = {}
	return render(request, 'tiles.html', context)
	
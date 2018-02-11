from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from datetime import datetime

from ..models import UserInfo

import django

'''
	Checks if the user sent valid requests,
	then attempts to authenticate the info,
	if succeeds, it logs the user in. Otherwise
	it returns an error indicating the issue
'''
def login(request):
	name = request.POST.get('username', False)
	password = request.POST.get('password', False)

	if not name or not password:
		return JsonResponse({'failed':'Missing credentials'})

	user = authenticate(username=name, password=password)

	if user is not None:
		django.contrib.auth.login(request, user)
		return JsonResponse({'success':'User was logged in'})
	else:
		return JsonResponse({'failed':"User doesn't exist or credentials are wrong"})

	return JsonResponse({'failed':'There was a server error logging in'})
'''
	Simply uses the request to logout
'''
def logout(request):
	django.contrib.auth.logout(request)
	return JsonResponse({'success':'Logged out'})

'''
	Grabs and verifies post data,
	then checks to see if the user already exists,
	if not it creates a new user object
	and logs them in
'''
def register(request):
	username = request.POST.get('username', False)
	password = request.POST.get('password', False)
	email = request.POST.get('email', False)
	first = request.POST.get('first', False)
	last = request.POST.get('last', False)
	dob = request.POST.get('dob', False)

	if (not username or not password or not email or not first or not last or not dob):
		return JsonResponse({'failed':'Missing information'})

	if get_user_model().objects.filter(username=username).exists():
		return JsonResponse({'failed':'User already exists'})

	user = get_user_model().objects.create_user(username=username,
											password=password,
											email=email,
											first_name=first,
											last_name=last)	

	user_info = UserInfo.objects.get(user=user)
	user_info.date_of_birth = datetime.strptime(dob, '%Y-%m-%d')
	user_info.save()

	django.contrib.auth.login(request, user)

	return JsonResponse({'created':'Account made'})

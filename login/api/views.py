from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import get_user_model
from datetime import datetime

from ..models import UserInfo

def login(request):
	return JsonResponse({'details':'hello.'})

def logout(request):
	get_user_model().objects.get(username='brintnc').delete()
	return JsonResponse({'details':'hello.'})

def register(request):
	username = request.POST.get('username', False)
	password = request.POST.get('password', False)
	email = request.POST.get('email', False)
	first = request.POST.get('first', False)
	last = request.POST.get('last', False)
	dob = request.POST.get('dob', False)
	timezone = request.POST.get('timezone', False)

	if (not username or not password or not email or not first or not last or not dob or not timezone):
		return JsonResponse({'failed':'Missing information'})

	if get_user_model().objects.filter(username=username).exists():
		return JsonResponse({'failed':'User already exists.'})

	user = get_user_model().objects.create_user(username=username,
											password=password,
											email=email,
											first_name=first,
											last_name=last)	

	user_info = UserInfo.objects.get(user=user)
	user_info.date_of_birth = datetime.strptime(dob, '%Y-%m-%d')
	user_info.save()

	return JsonResponse({'created':'Account made.'})

from django.http import JsonResponse

def login(request):
	return JsonResponse({'details':'hello.'})

def logout(request):
	return JsonResponse({'details':'hello.'})

def register(request):

	username = request.POST.get('username', False)
	password = request.POST.get('password', False)
	email = request.POST.get('email', False)
	first = request.POST.get('first_name', False)
	last = request.POST.get('last_name', False)
	dob = request.POST.get('dob', False)
	timezone = request.POST.get('timezone', False)

	if (not username or not password or not email or not first or not last or notdob or not timezone):
		return JsonResponse({'details':'Missing information'})

	return JsonResponse({'details':'hello.'})

from django.http import JsonResponse
from django.db.models import Q
from .models import Album
from .models import Photo
from .models import Tag

def get_photos(request):
    param_dict = generate_param_dict(request.META['QUERY_STRING'])
    pass

def generate_param_dict(query_string):
    default_dict = {
        'album_name': '',
        'album_id': '',
        'album_desc': '',
        'photo_id': '',
        'photo_location': '',
        'photo_time_start': 0,
        'photo_time_end': 0,
        'tag': [],
        'user': '',
    }

    if query_string == '':
        return None

    if query_string.contains("?"):
        for query in query_string.split("?"):
            query_id, query_value = query.split("=")
            if default_dict[query_id] == 'tag':  # Edge Case
                default_dict[query_id].append(query_value)
            else:
                default_dict[query_id] = query_value

    return default_dict    
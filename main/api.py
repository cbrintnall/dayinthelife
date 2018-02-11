from django.http import JsonResponse
from django.db.models import Q
from .models import Album
from .models import Photo

def get_photos(request):
    param_dict = generate_param_dict(request.META['QUERY_STRING'])
    
    query_album_set = Album.objects.all()
    if param_dict['album_id']:
        query_album_set = query_album_set.filter(id=param_dict['album_id'])
    if param_dict['album_desc']:
        query_album_set = query_album_set.filter(album_description__icontains=param_dict['album_desc'])
    if param_dict['album_title']:
        query_album_set = query_album_set.filter(album_title__icontains=param_dict['album_title'])

    q_tag_object = None
    for tag in param_dict['tag']:
        if q_tag_object is None:
            q_tag_object = Q(album_tags__icontains=tag)
        else:
            q_tag_object = q_tag_object | Q(album_tags__icontains=tag)
    if q_tag_object:
        query_album_set.filter(q_tag_object)

    query_photo_set = Photo.objects.all()
    if param_dict['photo_id']:
        query_photo_set = query_photo_set.filter(id=param_dict['photo_id'])
    if param_dict['photo_location']:
        query_photo_set = query_photo_set.filter(photo_location__icontains=param_dict['photo_location'])
    if param_dict['photo_time_start']:
        query_photo_set = query_photo_set.filter(photo_time__gte=param_dict['photo_time_start'])
    if param_dict['photo_time_end']:
        query_photo_set = query_photo_set.filter(photo_time__lte=param_dict['photo_time_end'])
    
    json_response = [{
        'albums': [
            {
                'album_description': album.album_description,
                'album_owner': album.album_owner.username,
                'album_title': album.album_title,
                'album_tags': album.album_tags,
                'photos': [
                    {
                        'photo_time': photo.photo_time,
                        'photo_location': photo.photo_location,
                        'photo_album': photo.photo_album.album_title,
                    }
                    for photo in album.photo_album
                ]
            }
            for album in query_album_set
        ],
        'photos': [
            {
                'photo_time': photo.photo_time,
                'photo_location': photo.photo_location,
                'photo_album': photo.photo_album.album_title,
            }
            for photo in query_photo_set
        ]
    }]

    return JsonResponse(json_response, safe=False)

def generate_photo_json(photo):
    return {
        'photo_time': photo.photo_time,
        'photo_location': photo.photo_location,
        'photo_album': photo.photo_album.album_title,
    }

def generate_param_dict(query_string):
    default_dict = {
        'album_title': None,
        'album_id': None,
        'album_desc': None,
        'photo_id': None,
        'photo_location': None,
        'photo_time_start': None,
        'photo_time_end': None,
        'tag': [],
        'user': None,
    }

    if query_string == '':
        return None

    if "?" not in query_string:
        add_to_dict(default_dict, query_string)
    else:
        for query in query_string.split("?"):
            add_to_dict(default_dict, query)
    
    return default_dict

def add_to_dict(ref_dict, query):
    query_id, query_value = query.split("=")
    if query_id == 'tag':
        ref_dict[query_id].append(query_value)
    else:
        # Replace url spaces with true spaces
        query_value = query_value.replace("%20", " ") 
        ref_dict[query_id] = query_value

from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from django.db.models import Q
from ..models import Album
from ..models import Photo
from django.conf import settings
import exifread
from geopy.geocoders import Nominatim as nom
import os
from datetime import datetime

def get_photos(request):
    param_dict = generate_param_dict(request.META['QUERY_STRING'])  # Creates a dict from a query string
    
    query_album_set = Album.objects.all()  # Create an initial query object

    # Filter albums upon its id, description, and title if given
    if param_dict['album_id']:
        query_album_set = query_album_set.filter(id=param_dict['album_id'])
    if param_dict['album_desc']:
        query_album_set = query_album_set.filter(album_description__icontains=param_dict['album_desc'])
    if param_dict['album_title']:
        query_album_set = query_album_set.filter(album_title__icontains=param_dict['album_title'])

    """
        Tags need to be stringed together via multiple 'OR's
        This is done by iterating through the tags given, setting an object
        if it hasn't been created and then strining together the future Q
        objects with an OR operator.

        In the end, the original album_set will filter with this new Q Object
    """
    q_tag_object = None
    for tag in param_dict['tag']:
        if q_tag_object is None:
            q_tag_object = Q(album_tags__icontains=tag)
        else:
            q_tag_object = q_tag_object | Q(album_tags__icontains=tag)
    if q_tag_object:
        query_album_set.filter(q_tag_object)

    # Filter photo requests upon its id, location, and time.
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


def generate_param_dict(query_string):
    """
    Params: (String) query_string - This is basically everything after the ? in a api call
    
    Returns: (Dictionary) - It will return a dictionary similar to the one immedietely under
        this comment. This will be used later on to filter our query set based upon this values.
    """
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

    if query_string == '':  # If no query was given to us, there's nothing to do
        return None

    if "?" not in query_string:  # Special situation where only one parameter was given to us
        add_to_dict(default_dict, query_string)
    else:
        for query in query_string.split("?"):  # Otherwise we iterate through our params
            add_to_dict(default_dict, query)
    
    return default_dict

def add_to_dict(ref_dict, query):
    """
    Params:
        ref_dict (Dictionary)  - The original dictionary filled with params. Since
            this is an object and python passes those by refrences, hence the reason
            we don't return this.
        query (String) - This contains data in the form of A=B where A is the param id 
            and B is the param value. We split this across the = and update the values
            in ref_dict
    """
    query_id, query_value = query.split("=")
    if query_id == 'tag':  # Edge case, tag is a list
        ref_dict[query_id].append(query_value)
    else:
        query_value = query_value.replace("%20", " ")  # Replace url spaces with true spaces
        ref_dict[query_id] = query_value

def create_album(request):

    title = request.GET.get('title', False)
    description = request.GET.get('description', False)
    tags = request.GET.get('tags', False)

    if not title or not description or not tags:
        return JsonResponse({'failed':'Information was missing, try again with more info'})

    new_album = Album.objects.create(album_title=title,
                                    album_description=description,
                                    album_tags=tags,
                                    album_owner=request.user)
    new_album.save()

    return JsonResponse({'success':'{}'.format(new_album.pk)})

'''

    Should be called when files have completed uploading.
    
'''
def add_photo(request, album_id):

    if not Album.objects.filter(pk=album_id).exists():
        return JsonResponse({"failed":"Album does not exist"})

    if Album.objects.get(pk=album_id).closed:
        return JsonResponse({'failed':'Album is closed'})
        
    path = request.GET.get('path', False)
    
    if not path:
        return JsonResponse({'failed':'Please specify a path to the file (that is already on the server)'})

    parent_album = Album.objects.get(pk=album_id)
    photo = Photo.objects.create(photo_location=path, photo_album=parent_album)

    # Open the photo file for processing
    f = open("{}/media{}".format(settings.BASE_DIR, path), 'rb')

    # Grab EXIF tags
    tags = exifread.process_file(f)

    time = tags.get('EXIF DateTimeOriginal')
    geolocater = nom()
    
    city = None

    if any('GPS GPSLongitude' in tag for tag in tags):
        longlist = list(tags.get('GPS GPSLongitude').values)
        longitude = longlist[0].num + (longlist[1].num/60) + longlist[2].num/longlist[2].den/3600
        if tags.get('GPS GPSLongitudeRef').values[0] == "W":
            longitude = longitude * -1

        latlist = list(tags.get('GPS GPSLatitude').values)
        latitude = latlist[0].num + (latlist[1].num/60) + latlist[2].num/latlist[2].den/3600
        if tags.get('GPS GPSLatitudeRef').values[0] == "S":
            latitude = latitude * -1

        location = geolocater.reverse([latitude, longitude], language='en')
        city = location.raw.get('address').get('city')

    f.close()

    photo.photo_city = city
    photo.photo_time = datetime.strptime(str(time), '%Y:%m:%d %H:%M:%S')

    photo.save()

    return JsonResponse({'success':'Added photo {} to album {}'.format(photo.pk, album_id)})

def close_album(request, album_id):

    if Album.objects.filter(pk=album_id).exists():
        album = Album.objects.get(pk=album_id)
        album.closed = True
        album.save()
    else:
        return JsonResponse({'failed':"Couldn't find album {}".format(album_id)})

    return JsonResponse({'success':'Closed album {}'.format(album_id)})
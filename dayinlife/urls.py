from django.urls import include, path
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('auth/', include('login.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as media_serve

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include([
        path('', include('users.urls')),
        path('', include('services.urls')),
        path('', include('bookings.urls')),
        path('', include('payments.urls')),
        path('', include('providers.urls')),
        path('', include('reviews.urls')),
        path('', include('chat.urls')),
        path('', include('promos.urls')),
        path('', include('support.urls')),
        path('admin/', include('admin_dashboard.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', media_serve, {'document_root': settings.MEDIA_ROOT}),
    ]

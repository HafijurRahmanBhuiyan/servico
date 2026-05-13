from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include([
        path('', include('users.urls')),
        path('', include('services.urls')),
        path('', include('bookings.urls')),
        path('', include('payments.urls')),
        path('', include('providers.urls')),
        path('', include('reviews.urls')),
        path('', include('promos.urls')),
        path('admin/', include('admin_dashboard.urls')),
    ])),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

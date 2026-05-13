from django.urls import path
from . import views

urlpatterns = [
    path('bookings/', views.BookingCreateView.as_view()),
    path('bookings/my/', views.UserBookingListView.as_view()),
    path('admin/bookings/', views.AdminBookingListView.as_view()),
    path('admin/bookings/<int:pk>/', views.AdminBookingDetailView.as_view()),
    path('provider/jobs/', views.ProviderJobListView.as_view()),
    path('provider/jobs/<int:pk>/status/', views.ProviderJobActionView.as_view()),
]

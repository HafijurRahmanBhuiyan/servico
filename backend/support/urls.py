from django.urls import path
from . import views

urlpatterns = [
    path('support/messages/', views.SupportMessageCreateView.as_view()),
    path('admin/support/', views.AdminSupportListView.as_view()),
    path('admin/support/<int:pk>/', views.AdminSupportDetailView.as_view()),
]

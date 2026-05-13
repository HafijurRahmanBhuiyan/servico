from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view()),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view()),
    path('services/', views.ServiceListView.as_view()),
    path('services/<int:pk>/', views.ServiceDetailView.as_view()),
]

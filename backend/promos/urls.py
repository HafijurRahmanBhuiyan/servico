from django.urls import path
from . import views

urlpatterns = [
    path('promos/validate/', views.ValidatePromoView.as_view()),
    path('admin/promos/', views.AdminPromoListView.as_view()),
    path('admin/promos/<str:code>/', views.AdminPromoDetailView.as_view()),
]

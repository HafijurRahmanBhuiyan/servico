from django.urls import path
from . import views

urlpatterns = [
    path('provider/application/', views.ProviderApplicationView.as_view()),
    path('providers/<int:pk>/', views.ProviderPublicDetailView.as_view()),
    path('admin/providers/', views.AdminProviderListView.as_view()),
    path('admin/providers/<int:pk>/', views.AdminProviderDetailView.as_view()),
    path('provider/earnings/', views.ProviderEarningsView.as_view()),
]

from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.AdminDashboardStatsView.as_view()),
    path('settings/', views.AdminSiteSettingsView.as_view()),
]

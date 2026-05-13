from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('login/', views.CustomLoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', views.MeView.as_view()),
    path('me/change-password/', views.ChangePasswordView.as_view()),
    path('admin/users/', views.AdminUserListView.as_view()),
    path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view()),
]

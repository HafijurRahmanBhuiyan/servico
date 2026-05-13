from django.urls import path
from . import views

urlpatterns = [
    path('services/<int:service_id>/reviews/', views.ServiceReviewListView.as_view()),
    path('reviews/', views.ReviewCreateView.as_view()),
    path('admin/reviews/', views.AdminReviewListView.as_view()),
    path('admin/reviews/<int:pk>/', views.AdminReviewDetailView.as_view()),
]

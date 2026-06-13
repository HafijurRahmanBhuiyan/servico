from django.urls import path
from . import views

urlpatterns = [
    path('payments/bkash/initiate/', views.BkashInitiateView.as_view()),
    path('payments/bkash/callback/', views.BkashCallbackView.as_view()),
    path('payments/nagad/initiate/', views.NagadInitiateView.as_view()),
    path('payments/nagad/callback/', views.NagadCallbackView.as_view()),
    path('payments/complete/', views.PaymentCompleteView.as_view()),
    path('admin/payments/', views.AdminPaymentListView.as_view()),
    path('admin/payments/<int:pk>/', views.AdminPaymentDetailView.as_view()),
]

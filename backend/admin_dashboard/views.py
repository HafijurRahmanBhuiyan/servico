from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from users.models import User
from services.models import Service, Category
from bookings.models import Booking
from payments.models import Payment
from providers.models import ProviderApplication
from reviews.models import Review
from django.db.models import Sum, Count
from django.utils import timezone
from .models import SiteSetting
import datetime

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        this_month_start = today.replace(day=1)
        total_revenue = Payment.objects.filter(status='paid').aggregate(s=Sum('amount'))['s'] or 0
        month_revenue = Payment.objects.filter(status='paid', created_at__date__gte=this_month_start).aggregate(s=Sum('amount'))['s'] or 0
        stats = {
            'total_users': User.objects.filter(role='customer').count(),
            'total_providers': ProviderApplication.objects.filter(status='approved').count(),
            'pending_providers': ProviderApplication.objects.filter(status='pending').count(),
            'total_services': Service.objects.filter(is_active=True).count(),
            'total_bookings': Booking.objects.count(),
            'pending_bookings': Booking.objects.filter(status='pending').count(),
            'completed_bookings': Booking.objects.filter(status='completed').count(),
            'total_revenue': float(total_revenue),
            'month_revenue': float(month_revenue),
            'total_reviews': Review.objects.count(),
            'recent_bookings': list(
                Booking.objects.order_by('-created_at')[:8].values(
                    'id', 'customer_name', 'service__title', 'status', 'total_amount', 'created_at', 'payment_method'
                )
            ),
        }
        return Response(stats)

class AdminSiteSettingsView(APIView):
    """
    GET/PATCH /api/admin/settings/
    Returns and updates site-wide settings persisted in the database.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        return Response({
            'site_name': setting.site_name,
            'tagline': setting.tagline,
            'support_email': setting.support_email,
            'support_phone': setting.support_phone,
            'visiting_fee': float(setting.visiting_fee),
            'urgent_surcharge': float(setting.urgent_surcharge),
            'vat_percent': float(setting.vat_percent),
            'bkash_number': setting.bkash_number,
            'nagad_number': setting.nagad_number,
            'bank_account_number': setting.bank_account_number,
        })

    def patch(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        for field in ['site_name', 'tagline', 'support_email', 'support_phone',
                      'bkash_number', 'nagad_number', 'bank_account_number']:
            if field in request.data:
                setattr(setting, field, request.data[field])
        for field in ['visiting_fee', 'urgent_surcharge', 'vat_percent']:
            if field in request.data:
                setattr(setting, field, float(request.data[field]))
        setting.save()
        return Response({'message': 'Settings updated successfully'})

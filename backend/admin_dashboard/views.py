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
    Returns and updates site-wide settings.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            'site_name': 'Servico',
            'tagline': 'Home services, on demand.',
            'support_email': 'support@servico.com',
            'support_phone': '+880-1700-000000',
            'visiting_fee': 150,
            'urgent_surcharge': 100,
            'vat_percent': 5,
        })

    def patch(self, request):
        return Response({'message': 'Settings updated (implement persistence as needed)'})

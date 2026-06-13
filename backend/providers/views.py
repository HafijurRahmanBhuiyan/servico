from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from .models import ProviderApplication, ProviderEarning
from .serializers import ProviderApplicationSerializer, ProviderApplicationCreateSerializer, AdminProviderSerializer, ProviderPublicSerializer, ProviderEarningSerializer

class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'provider_application')

class ProviderApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            app = request.user.provider_application
            return Response(ProviderApplicationSerializer(app).data)
        except ProviderApplication.DoesNotExist:
            return Response({'detail': 'No application found'}, status=404)

    def post(self, request):
        if hasattr(request.user, 'provider_application'):
            return Response({'error': 'Application already submitted'}, status=400)
        serializer = ProviderApplicationCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def patch(self, request):
        try:
            app = request.user.provider_application
        except ProviderApplication.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        serializer = ProviderApplicationCreateSerializer(app, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class AdminProviderListView(generics.ListAPIView):
    serializer_class = AdminProviderSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ProviderApplication.objects.select_related('user').order_by('-applied_at')
    filterset_fields = ['status']

class AdminProviderDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        try:
            app = ProviderApplication.objects.get(pk=pk)
        except ProviderApplication.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(AdminProviderSerializer(app).data)

    def patch(self, request, pk):
        try:
            app = ProviderApplication.objects.select_related('user').get(pk=pk)
        except ProviderApplication.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        new_status = request.data.get('status')
        reject_reason = request.data.get('reject_reason', '')
        if new_status not in ['pending', 'approved', 'rejected', 'suspended']:
            return Response({'error': 'Invalid status'}, status=400)
        app.status = new_status
        if reject_reason:
            app.reject_reason = reject_reason
        if new_status == 'approved' and not app.user.is_superuser:
            app.user.role = 'provider'
            app.user.save()
        app.save()
        return Response(AdminProviderSerializer(app).data)

class ProviderPublicDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            app = ProviderApplication.objects.get(pk=pk, status='approved')
        except ProviderApplication.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(ProviderPublicSerializer(app).data)

class ProviderEarningsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        app = request.user.provider_application
        earnings = ProviderEarning.objects.filter(provider=app).order_by('-period_start')
        total_earned = app.total_earnings
        this_month = earnings.filter(period_start__month=__import__('datetime').date.today().month).aggregate(s=Sum('amount'))['s'] or 0
        data = {
            'total_earned': total_earned,
            'this_month': this_month,
            'pending_payout': earnings.filter(status='processing').aggregate(s=Sum('amount'))['s'] or 0,
            'weekly': ProviderEarningSerializer(earnings[:12], many=True).data,
        }
        return Response(data)

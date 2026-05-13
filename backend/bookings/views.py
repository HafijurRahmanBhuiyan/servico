from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer, AdminBookingSerializer

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).select_related('service')

class AdminBookingListView(generics.ListAPIView):
    serializer_class = AdminBookingSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Booking.objects.all().select_related('service', 'customer')
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'payment_method', 'payment_status']

class AdminBookingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AdminBookingSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Booking.objects.all()

class ProviderJobListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            app = self.request.user.provider_application
        except:
            return Booking.objects.none()
        return Booking.objects.filter(provider=app).select_related('service')

class ProviderJobActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            app = request.user.provider_application
            booking = Booking.objects.get(pk=pk, provider=app)
        except:
            return Response({'detail': 'Not found'}, status=404)
        new_status = request.data.get('status')
        if new_status not in ['accepted', 'in_progress', 'completed', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=400)
        booking.status = new_status
        booking.save()
        return Response(BookingSerializer(booking).data)

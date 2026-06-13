from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer
from bookings.models import Booking

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        booking_id = self.kwargs['booking_id']
        user = self.request.user
        return Message.objects.filter(
            Q(booking_id=booking_id, booking__customer=user) |
            Q(booking_id=booking_id, booking__provider__user=user)
        ).select_related('sender')

    def perform_create(self, serializer):
        booking_id = self.kwargs['booking_id']
        user = self.request.user
        try:
            booking = Booking.objects.get(
                Q(pk=booking_id, customer=user) |
                Q(pk=booking_id, provider__user=user)
            )
        except Booking.DoesNotExist:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not part of this booking.')
        serializer.save(sender=user, booking=booking)

class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.none()

        if hasattr(user, 'provider_application') and user.provider_application:
            bookings = Booking.objects.filter(provider=user.provider_application)
        elif user.role == 'customer':
            bookings = Booking.objects.filter(customer=user)

        data = []
        for b in bookings:
            msg = Message.objects.filter(booking=b).order_by('-created_at').first()
            if msg is None:
                continue
            other_name = b.customer.full_name if user.role == 'provider' else (b.provider.full_name if b.provider else 'Provider')
            unread = Message.objects.filter(booking=b, read=False).exclude(sender=user).count()
            data.append({
                'booking_id': b.id,
                'service_title': b.service.title,
                'other_name': other_name,
                'last_message': msg.message,
                'last_time': msg.created_at.isoformat(),
                'unread': unread,
            })

        return Response(data)

class MarkMessagesReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, booking_id):
        user = request.user
        Message.objects.filter(
            booking_id=booking_id, read=False
        ).exclude(sender=user).filter(
            Q(booking__customer=user) | Q(booking__provider__user=user)
        ).update(read=True)
        return Response({'ok': True}, status=status.HTTP_200_OK)

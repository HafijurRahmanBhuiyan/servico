from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import SupportMessage
from .serializers import (
    SupportMessageCreateSerializer,
    SupportMessageListSerializer,
    SupportMessageReplySerializer,
)


class SupportMessageCreateView(generics.CreateAPIView):
    serializer_class = SupportMessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class AdminSupportListView(generics.ListAPIView):
    serializer_class = SupportMessageListSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = SupportMessage.objects.all().select_related('user')
    filterset_fields = ['status']


class AdminSupportDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        try:
            msg = SupportMessage.objects.select_related('user').get(pk=pk)
        except SupportMessage.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(SupportMessageListSerializer(msg).data)

    def patch(self, request, pk):
        try:
            msg = SupportMessage.objects.get(pk=pk)
        except SupportMessage.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)

        reply_serializer = SupportMessageReplySerializer(data=request.data)
        if not reply_serializer.is_valid():
            return Response(reply_serializer.errors, status=400)

        data = reply_serializer.validated_data
        msg.admin_reply = data['admin_reply']
        msg.status = data['status']
        msg.replied_at = timezone.now()
        msg.save()
        return Response(SupportMessageListSerializer(msg).data)

    def delete(self, request, pk):
        try:
            msg = SupportMessage.objects.get(pk=pk)
        except SupportMessage.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        msg.delete()
        return Response(status=204)

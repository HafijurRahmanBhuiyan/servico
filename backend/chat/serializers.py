from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'booking', 'sender', 'sender_name', 'sender_role', 'message', 'created_at', 'read']
        read_only_fields = ['id', 'booking', 'sender', 'created_at', 'read']

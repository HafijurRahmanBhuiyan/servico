from rest_framework import serializers
from .models import SupportMessage


class SupportMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportMessage
        fields = ['id', 'subject', 'message']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SupportMessageListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = SupportMessage
        fields = [
            'id', 'user', 'user_name', 'user_email', 'user_phone',
            'subject', 'message', 'status', 'admin_reply', 'replied_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'admin_reply', 'replied_at', 'created_at', 'updated_at']


class SupportMessageReplySerializer(serializers.Serializer):
    admin_reply = serializers.CharField()
    status = serializers.ChoiceField(choices=SupportMessage.STATUS_CHOICES, default='replied')

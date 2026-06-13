from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)
    date = serializers.DateTimeField(source='created_at', read_only=True)

    provider_name = serializers.SerializerMethodField()
    provider_id = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'customer_name', 'service', 'service_title', 'booking', 'rating', 'text', 'status', 'created_at', 'date', 'provider_name', 'provider_id']
        read_only_fields = ['customer_name', 'status', 'created_at', 'date']

    def get_provider_name(self, obj):
        if obj.booking and obj.booking.provider:
            return obj.booking.provider.full_name
        return ''

    def get_provider_id(self, obj):
        if obj.booking and obj.booking.provider:
            return obj.booking.provider.id
        return None

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['service', 'booking', 'rating', 'text']

    def validate_rating(self, v):
        if not (1 <= v <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return v

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)

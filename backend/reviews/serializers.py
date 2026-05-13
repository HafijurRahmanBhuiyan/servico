from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'customer_name', 'service', 'service_title', 'booking', 'rating', 'text', 'status', 'created_at']
        read_only_fields = ['customer_name', 'status', 'created_at']

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

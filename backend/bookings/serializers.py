from rest_framework import serializers
from .models import Booking
from services.serializers import ServiceListSerializer

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'service', 'customer_name', 'phone', 'address', 'notes',
            'scheduled_date', 'scheduled_time', 'is_urgent', 'payment_method',
            'promo_code', 'service_charge', 'visiting_charge', 'urgent_fee',
            'discount_amount', 'vat', 'wallet_used', 'total_amount',
        ]

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)

class BookingSerializer(serializers.ModelSerializer):
    service = ServiceListSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = '__all__'

class AdminBookingSerializer(serializers.ModelSerializer):
    service = ServiceListSerializer(read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    provider_name = serializers.CharField(source='provider.full_name', read_only=True, default=None)
    class Meta:
        model = Booking
        fields = '__all__'

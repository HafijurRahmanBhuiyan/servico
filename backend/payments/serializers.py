from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='booking.service.title', read_only=True)
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'

class InitiatePaymentSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

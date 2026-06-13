from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='booking.service.title', read_only=True)
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    customer_phone = serializers.CharField(source='booking.phone', read_only=True)
    booking_address = serializers.CharField(source='booking.address', read_only=True)
    booking_date = serializers.DateField(source='booking.scheduled_date', read_only=True)
    booking_status = serializers.CharField(source='booking.status', read_only=True)
    service_id = serializers.IntegerField(source='booking.service.id', read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'

class InitiatePaymentSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()

class CompletePaymentSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    method = serializers.ChoiceField(choices=['cash', 'bkash', 'nagad', 'card'])
    phone = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=['pending', 'paid'], default='paid')

from rest_framework import serializers
from .models import PromoCode

class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = '__all__'
        read_only_fields = ['used_count', 'created_at']

class PromoValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)

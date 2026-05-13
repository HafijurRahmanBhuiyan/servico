from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PromoCode
from .serializers import PromoCodeSerializer, PromoValidateSerializer

class ValidatePromoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PromoValidateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        code = serializer.validated_data['code'].upper()
        order_total = serializer.validated_data['order_total']
        try:
            promo = PromoCode.objects.get(code=code)
        except PromoCode.DoesNotExist:
            return Response({'error': 'Invalid or expired promo code'}, status=400)
        if not promo.is_valid():
            return Response({'error': 'This promo code has expired or reached its usage limit'}, status=400)
        if order_total < promo.min_order:
            return Response({'error': f'Minimum order of ৳{promo.min_order} required for this code'}, status=400)
        if promo.type == 'percent':
            discount = round(order_total * promo.value / 100, 2)
        else:
            discount = min(promo.value, order_total)
        return Response({'type': promo.type, 'value': float(promo.value), 'discount': float(discount), 'code': promo.code})

class AdminPromoListView(generics.ListCreateAPIView):
    serializer_class = PromoCodeSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = PromoCode.objects.all().order_by('-created_at')

class AdminPromoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PromoCodeSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = PromoCode.objects.all()
    lookup_field = 'code'

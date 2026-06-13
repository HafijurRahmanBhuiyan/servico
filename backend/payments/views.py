from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Payment
from .serializers import PaymentSerializer, InitiatePaymentSerializer, CompletePaymentSerializer
from .bkash import get_bkash_token, create_bkash_payment, execute_bkash_payment, query_bkash_payment
from .nagad import initiate_nagad_payment, complete_nagad_payment
from bookings.models import Booking
from admin_dashboard.models import SiteSetting

class BkashInitiateView(APIView):
    """
    POST /api/payments/bkash/initiate/
    Body: { "booking_id": 123 }
    Response: { "bkashURL": "...", "paymentID": "..." }
    Frontend should redirect user to bkashURL.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        booking_id = serializer.validated_data['booking_id']
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        if booking.payment_method != 'bkash':
            return Response({'error': 'Payment method is not bKash'}, status=400)
        try:
            token = get_bkash_token()
            result = create_bkash_payment(token, float(booking.total_amount), booking.id)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        if result.get('statusCode') != '0000':
            return Response({'error': result.get('statusMessage', 'bKash error')}, status=400)
        # Store or update payment record
        payment, _ = Payment.objects.get_or_create(booking=booking, defaults={'customer': request.user, 'method': 'bkash', 'amount': booking.total_amount})
        payment.gateway_payment_id = result.get('paymentID', '')
        payment.gateway_response = result
        payment.status = 'pending'
        payment.save()
        booking.payment_reference = result.get('paymentID', '')
        booking.save()
        return Response({'bkashURL': result.get('bkashURL'), 'paymentID': result.get('paymentID')})

@method_decorator(csrf_exempt, name='dispatch')
class BkashCallbackView(APIView):
    """
    GET /api/payments/bkash/callback/
    bKash redirects here after user approves or cancels.
    Query params: paymentID, status
    """
    permission_classes = []

    def get(self, request):
        payment_id = request.GET.get('paymentID')
        gateway_status = request.GET.get('status')
        if not payment_id or gateway_status == 'cancel':
            return redirect('http://localhost:5173/payment/failed?reason=cancelled')
        try:
            payment = Payment.objects.get(gateway_payment_id=payment_id)
        except Payment.DoesNotExist:
            return redirect('http://localhost:5173/payment/failed?reason=not_found')
        try:
            token = get_bkash_token()
            result = execute_bkash_payment(token, payment_id)
        except Exception:
            return redirect('http://localhost:5173/payment/failed?reason=execution_error')
        if result.get('statusCode') == '0000':
            payment.status = 'paid'
            payment.gateway_transaction_id = result.get('trxID', '')
            payment.gateway_response = result
            payment.save()
            payment.booking.payment_status = 'paid'
            payment.booking.payment_reference = result.get('trxID', '')
            payment.booking.status = 'confirmed'
            payment.booking.save()
            return redirect(f"http://localhost:5173/dashboard/bookings?payment=success")
        else:
            payment.status = 'failed'
            payment.gateway_response = result
            payment.save()
            return redirect(f"http://localhost:5173/payment/failed?reason=bkash_failure")

class NagadInitiateView(APIView):
    """
    POST /api/payments/nagad/initiate/
    Body: { "booking_id": 123 }
    Response: { "redirectURL": "..." }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        booking_id = serializer.validated_data['booking_id']
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        try:
            init_result = initiate_nagad_payment(booking.id, float(booking.total_amount))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        if 'paymentReferenceId' not in init_result:
            return Response({'error': 'Nagad initiation failed', 'detail': init_result}, status=400)
        payment_ref_id = init_result['paymentReferenceId']
        try:
            complete_result = complete_nagad_payment(payment_ref_id, booking.id, float(booking.total_amount))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        payment, _ = Payment.objects.get_or_create(booking=booking, defaults={'customer': request.user, 'method': 'nagad', 'amount': booking.total_amount})
        payment.gateway_payment_id = payment_ref_id
        payment.gateway_response = complete_result
        payment.status = 'pending'
        payment.save()
        redirect_url = complete_result.get('callBackUrl', '')
        return Response({'redirectURL': redirect_url, 'paymentReferenceId': payment_ref_id})

@method_decorator(csrf_exempt, name='dispatch')
class NagadCallbackView(APIView):
    """
    GET/POST /api/payments/nagad/callback/
    Nagad redirects here after payment.
    Query params: payment_ref_id, order_id, status
    """
    permission_classes = []

    def get(self, request):
        order_id = request.GET.get('order_id')
        nagad_status = request.GET.get('status', '')
        if not order_id:
            return redirect('http://localhost:5173/payment/failed?reason=missing_order')
        try:
            booking = Booking.objects.get(id=order_id)
            payment = booking.payment
        except (Booking.DoesNotExist, Payment.DoesNotExist):
            return redirect('http://localhost:5173/payment/failed?reason=not_found')
        if nagad_status == 'Success':
            payment.status = 'paid'
            payment.gateway_transaction_id = request.GET.get('payment_ref_id', '')
            payment.save()
            booking.payment_status = 'paid'
            booking.status = 'confirmed'
            booking.save()
            return redirect('http://localhost:5173/dashboard/bookings?payment=success')
        else:
            payment.status = 'failed'
            payment.save()
            return redirect('http://localhost:5173/payment/failed?reason=nagad_failure')

class PaymentCompleteView(APIView):
    """
    POST /api/payments/complete/
    Body: { "booking_id": 123, "method": "bkash", "phone": "01XXXXXXXXX", "status": "paid" }
    Creates/updates a Payment record and marks the booking as paid/confirmed.
    Used when the payment flow completes (real gateway or simulated fallback).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompletePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        booking_id = serializer.validated_data['booking_id']
        method = serializer.validated_data['method']
        phone = serializer.validated_data.get('phone', '')
        new_status = serializer.validated_data.get('status', 'paid')
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={'customer': request.user, 'method': method, 'amount': booking.total_amount}
        )
        if not created:
            payment.method = method
            payment.amount = booking.total_amount
        payment.gateway_response = {'phone': phone, 'completed_via': 'simulated' if method in ('bkash', 'nagad') else 'direct'}
        payment.gateway_transaction_id = f"TXN-{booking_id}-{int(booking.created_at.timestamp()) if booking.created_at else ''}"
        payment.status = new_status
        # Store merchant account from site settings
        try:
            site_settings = SiteSetting.objects.get(pk=1)
            if method == 'bkash':
                payment.merchant_account = site_settings.bkash_number
            elif method == 'nagad':
                payment.merchant_account = site_settings.nagad_number
            elif method in ('cash', 'card'):
                payment.merchant_account = site_settings.bank_account_number
        except SiteSetting.DoesNotExist:
            pass
        payment.save()
        booking.payment_method = method
        booking.payment_status = 'paid' if new_status == 'paid' else 'unpaid'
        booking.payment_reference = payment.gateway_transaction_id
        if new_status == 'paid':
            booking.status = 'confirmed'
        booking.save()
        return Response(PaymentSerializer(payment).data)

class AdminPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Payment.objects.all().select_related('booking__service', 'customer')
    filterset_fields = ['status', 'method']

class AdminPaymentDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        new_status = request.data.get('status')
        if new_status in ['paid', 'refunded', 'cancelled', 'pending']:
            payment.status = new_status
            payment.save()
            if new_status == 'refunded':
                payment.booking.payment_status = 'refunded'
                payment.booking.save()
        return Response(PaymentSerializer(payment).data)

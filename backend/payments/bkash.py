import requests
from django.conf import settings

BKASH_BASE_URL = settings.BKASH_BASE_URL  # e.g. https://tokenized.sandbox.bka.sh/v1.2.0-beta

def get_bkash_token():
    """Get a grant token from bKash. Call this before each payment session."""
    url = f"{BKASH_BASE_URL}/tokenized/checkout/token/grant"
    headers = {
        'username': settings.BKASH_USERNAME,
        'password': settings.BKASH_PASSWORD,
    }
    payload = {
        'app_key': settings.BKASH_APP_KEY,
        'app_secret': settings.BKASH_APP_SECRET,
    }
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    if data.get('statusCode') != '0000':
        raise Exception(f"bKash token error: {data.get('statusMessage')}")
    return data['id_token']

def create_bkash_payment(id_token, amount, booking_id):
    """Initiate a bKash payment. Returns bkashURL for redirect."""
    url = f"{BKASH_BASE_URL}/tokenized/checkout/create"
    headers = {
        'authorization': id_token,
        'x-app-key': settings.BKASH_APP_KEY,
    }
    payload = {
        'mode': '0011',                            # Tokenized Checkout
        'payerReference': str(booking_id),
        'callbackURL': f"http://localhost:8000/api/payments/bkash/callback/",
        'amount': str(amount),
        'currency': 'BDT',
        'intent': 'sale',
        'merchantInvoiceNumber': f"INV-{booking_id}",
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def execute_bkash_payment(id_token, payment_id):
    """Execute (confirm) a bKash payment after user approves on bKash app."""
    url = f"{BKASH_BASE_URL}/tokenized/checkout/execute"
    headers = {
        'authorization': id_token,
        'x-app-key': settings.BKASH_APP_KEY,
    }
    response = requests.post(url, json={'paymentID': payment_id}, headers=headers)
    return response.json()

def query_bkash_payment(id_token, payment_id):
    """Query bKash payment status — use for verification."""
    url = f"{BKASH_BASE_URL}/tokenized/checkout/payment/status"
    headers = {
        'authorization': id_token,
        'x-app-key': settings.BKASH_APP_KEY,
    }
    response = requests.post(url, json={'paymentID': payment_id}, headers=headers)
    return response.json()

def refund_bkash_payment(id_token, payment_id, trx_id, amount, reason='Customer request'):
    """Initiate a refund on a completed bKash payment."""
    url = f"{BKASH_BASE_URL}/tokenized/checkout/payment/refund"
    headers = {
        'authorization': id_token,
        'x-app-key': settings.BKASH_APP_KEY,
    }
    payload = {
        'paymentID': payment_id,
        'trxID': trx_id,
        'amount': str(amount),
        'currency': 'BDT',
        'reason': reason,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

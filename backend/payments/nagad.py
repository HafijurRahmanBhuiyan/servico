import requests
import json
import base64
import hashlib
import datetime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from django.conf import settings

NAGAD_BASE_URL = settings.NAGAD_BASE_URL
NAGAD_MERCHANT_ID = settings.NAGAD_MERCHANT_ID
NAGAD_MERCHANT_PRIVATE_KEY = settings.NAGAD_MERCHANT_PRIVATE_KEY

def _encrypt_with_nagad_public_key(data: str) -> str:
    """Encrypt sensitive data with Nagad's public key."""
    NAGAD_PUBLIC_KEY = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAryQICCl6NZ5gDKrnSztO
3Hy8PEUcuyvg/ikC+VcIo2SFFSf18a3IMYldIugqqqZCs4/4uVW3sbdLs/6PfgdX
7O9D22ZiFWHPYA2k2N744MNiCD1UE+tJyllUhSblK48bn+v1oZHCM0nYQ2NqUkvS
j+hwUU3g2JddSmjwmcbpFz2+YQFKZ9REAZhsOIFBIQRGPOt1K6wFWgPwWsOBJaV
sYMaX4KbI+WB8f+4luyJ+C8C1aTG+bMeWrfxBwuRdvkXvZiicAEHkRXPQ8/BMMH
Wg8iEoXMRmGlkKBlhWBH+geBUCDFrPhvv+PxhJwTb9sEbVDIOHcFHWKoAQOoQIDA
QIDAQAB
-----END PUBLIC KEY-----"""
    key = RSA.import_key(NAGAD_PUBLIC_KEY)
    cipher = PKCS1_v1_5.new(key)
    encrypted = cipher.encrypt(data.encode())
    return base64.b64encode(encrypted).decode()

def _sign_with_merchant_key(data: str) -> str:
    """Sign data with merchant's private key."""
    private_key = RSA.import_key(NAGAD_MERCHANT_PRIVATE_KEY)
    h = SHA256.new(data.encode())
    signature = pkcs1_15.new(private_key).sign(h)
    return base64.b64encode(signature).decode()

def initiate_nagad_payment(booking_id: int, amount: float) -> dict:
    """Step 1: Check merchant and get payment reference."""
    datetime_str = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    merchant_invoice_number = f"INV-{booking_id}"
    sensitive_data = {
        'merchantId': NAGAD_MERCHANT_ID,
        'datetime': datetime_str,
        'orderId': str(booking_id),
        'challenge': hashlib.md5(f"{NAGAD_MERCHANT_ID}{booking_id}{datetime_str}".encode()).hexdigest(),
    }
    encrypted_data = _encrypt_with_nagad_public_key(json.dumps(sensitive_data))
    signature = _sign_with_merchant_key(json.dumps(sensitive_data))
    payload = {
        'accountNumber': NAGAD_MERCHANT_ID,
        'dateTime': datetime_str,
        'sensitiveData': encrypted_data,
        'signature': signature,
    }
    url = f"{NAGAD_BASE_URL}/api/dfs/check-out/initialize/{NAGAD_MERCHANT_ID}/{booking_id}"
    response = requests.post(url, json=payload, headers={'Content-Type': 'application/json', 'X-KM-Api-Version': 'v-0.2.0', 'X-KM-IP-V4': '127.0.0.1', 'X-KM-Client-Type': 'PC_WEB'})
    return response.json()

def complete_nagad_payment(payment_ref_id: str, booking_id: int, amount: float) -> dict:
    """Step 2: Complete checkout with payment reference."""
    datetime_str = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    sensitive_data = {
        'merchantId': NAGAD_MERCHANT_ID,
        'orderId': str(booking_id),
        'amount': str(amount),
        'currencyCode': '050',
        'challenge': payment_ref_id,
    }
    encrypted_data = _encrypt_with_nagad_public_key(json.dumps(sensitive_data))
    signature = _sign_with_merchant_key(json.dumps(sensitive_data))
    payload = {
        'sensitiveData': encrypted_data,
        'signature': signature,
        'merchantCallbackURL': f"http://localhost:8000/api/payments/nagad/callback/",
        'additionalMerchantInfo': {'bill_number': f"INV-{booking_id}"},
    }
    url = f"{NAGAD_BASE_URL}/api/dfs/check-out/complete/{payment_ref_id}"
    response = requests.post(url, json=payload, headers={'Content-Type': 'application/json', 'X-KM-Api-Version': 'v-0.2.0', 'X-KM-IP-V4': '127.0.0.1', 'X-KM-Client-Type': 'PC_WEB'})
    return response.json()

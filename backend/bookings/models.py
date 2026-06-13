from django.db import models
from django.conf import settings
from services.models import Service

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('confirmed', 'Confirmed'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash on Delivery'),
        ('bkash', 'bKash'),
        ('nagad', 'Nagad'),
        ('card', 'Card (SSLCommerz)'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('pending_verification', 'Pending Verification'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name='bookings')
    provider = models.ForeignKey('providers.ProviderApplication', null=True, blank=True, on_delete=models.SET_NULL, related_name='jobs')
    # Contact
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    notes = models.TextField(blank=True)
    # Schedule
    scheduled_date = models.DateField()
    scheduled_time = models.CharField(max_length=20)   # e.g. "10:00 AM"
    is_urgent = models.BooleanField(default=False)
    # Pricing
    service_charge = models.DecimalField(max_digits=10, decimal_places=2)
    visiting_charge = models.DecimalField(max_digits=10, decimal_places=2, default=150)
    urgent_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    wallet_used = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.CharField(max_length=30, blank=True)
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    payment_reference = models.CharField(max_length=100, blank=True)  # bKash/Nagad transaction ID
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.service.title}"

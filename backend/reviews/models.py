from django.db import models
from django.conf import settings
from services.models import Service
from bookings.models import Booking

class Review(models.Model):
    STATUS_CHOICES = [
        ('published', 'Published'),
        ('hidden', 'Hidden'),
        ('flagged', 'Flagged'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='reviews')
    booking = models.OneToOneField(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='review')
    rating = models.PositiveSmallIntegerField()   # 1-5
    text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['customer', 'service']

    def __str__(self):
        return f"Review by {self.customer.full_name} on {self.service.title}"

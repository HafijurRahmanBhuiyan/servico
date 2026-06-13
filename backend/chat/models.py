from django.db import models
from django.conf import settings

class Message(models.Model):
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Msg from {self.sender.full_name} on booking #{self.booking_id}"

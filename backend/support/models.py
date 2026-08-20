from django.db import models
from django.conf import settings


class SupportMessage(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('replied', 'Replied'),
        ('closed', 'Closed'),
    ]

    SUBJECT_CHOICES = [
        ('general', 'General inquiry'),
        ('booking', 'Booking issue'),
        ('provider', 'Provider support'),
        ('complaint', 'Complaint'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_messages')
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    admin_reply = models.TextField(blank=True, default='')
    replied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'support_messages'
        ordering = ['-created_at']

    def __str__(self):
        return f"Support #{self.id} by {self.user.full_name} - {self.get_subject_display()}"

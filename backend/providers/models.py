from django.db import models
from django.conf import settings

class ProviderApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    ]
    AVAILABILITY_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('flexible', 'Flexible'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='provider_application')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    nid_number = models.CharField(max_length=30)
    address = models.TextField()
    experience_years = models.CharField(max_length=10)
    skills = models.JSONField(default=list)         # list of skill strings
    bio = models.TextField(blank=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='full_time')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reject_reason = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='provider_avatars/', null=True, blank=True)
    nid_file = models.FileField(upload_to='nid_files/', null=True, blank=True)
    # Aggregated stats
    total_jobs = models.PositiveIntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'provider_applications'

    def __str__(self):
        return f"{self.full_name} ({self.status})"

class ProviderEarning(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('scheduled', 'Scheduled'),
    ]
    provider = models.ForeignKey(ProviderApplication, on_delete=models.CASCADE, related_name='earnings')
    week_label = models.CharField(max_length=30)   # e.g. "May 5-11"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    period_start = models.DateField()
    period_end = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'provider_earnings'
        ordering = ['-period_start']

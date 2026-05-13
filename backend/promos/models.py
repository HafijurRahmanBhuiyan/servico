from django.db import models

class PromoCode(models.Model):
    TYPE_CHOICES = [
        ('percent', 'Percentage'),
        ('flat', 'Flat Amount'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    code = models.CharField(max_length=30, unique=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    value = models.DecimalField(max_digits=8, decimal_places=2)    # percent value or flat BDT amount
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(default=100)
    used_count = models.PositiveIntegerField(default=0)
    expiry = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'promo_codes'

    def __str__(self):
        return self.code

    def is_valid(self):
        from django.utils import timezone
        return (
            self.status == 'active' and
            self.used_count < self.max_uses and
            self.expiry >= timezone.now().date()
        )

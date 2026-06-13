from django.db import models

class SiteSetting(models.Model):
    site_name = models.CharField(max_length=200, default='Servico')
    tagline = models.CharField(max_length=200, default='Home services, on demand.')
    support_email = models.EmailField(default='support@servico.com')
    support_phone = models.CharField(max_length=20, default='+880-1700-000000')
    visiting_fee = models.DecimalField(max_digits=10, decimal_places=2, default=150)
    urgent_surcharge = models.DecimalField(max_digits=10, decimal_places=2, default=100)
    vat_percent = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    bkash_number = models.CharField(max_length=20, blank=True, default='')
    nagad_number = models.CharField(max_length=20, blank=True, default='')
    bank_account_number = models.CharField(max_length=50, blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'

    def __str__(self):
        return self.site_name

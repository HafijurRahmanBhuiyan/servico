from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review

def update_service_rating(service):
    agg = Review.objects.filter(service=service, status='published').aggregate(avg=Avg('rating'), count=Count('id'))
    service.rating = round(agg['avg'] or 0, 1)
    service.review_count = agg['count']
    service.save(update_fields=['rating', 'review_count'])

@receiver(post_save, sender=Review)
def on_review_save(sender, instance, **kwargs):
    update_service_rating(instance.service)

@receiver(post_delete, sender=Review)
def on_review_delete(sender, instance, **kwargs):
    update_service_rating(instance.service)

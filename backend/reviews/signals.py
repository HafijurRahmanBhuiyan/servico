from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review

def update_service_rating(service):
    agg = Review.objects.filter(service=service, status='published').aggregate(avg=Avg('rating'), count=Count('id'))
    service.rating = round(agg['avg'] or 0, 1)
    service.review_count = agg['count']
    service.save(update_fields=['rating', 'review_count'])

def update_provider_rating(booking):
    if not booking or not booking.provider:
        return
    provider = booking.provider
    from bookings.models import Booking
    reviews = Review.objects.filter(booking__provider=provider, status='published')
    agg = reviews.aggregate(avg=Avg('rating'), count=Count('id'))
    provider.average_rating = round(agg['avg'] or 0, 1)
    provider.total_jobs = Booking.objects.filter(provider=provider, status='completed').count()
    provider.save(update_fields=['average_rating', 'total_jobs'])

@receiver(post_save, sender=Review)
def on_review_save(sender, instance, **kwargs):
    update_service_rating(instance.service)
    update_provider_rating(instance.booking)

@receiver(post_delete, sender=Review)
def on_review_delete(sender, instance, **kwargs):
    update_service_rating(instance.service)
    update_provider_rating(instance.booking)

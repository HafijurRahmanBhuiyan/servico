from django.db import models

class Category(models.Model):
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, blank=True)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        ordering = ['sort_order', 'label']

    def __str__(self):
        return self.label

class ServiceFAQ(models.Model):
    service = models.ForeignKey('Service', on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()
    answer = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

class ServiceProcessStep(models.Model):
    service = models.ForeignKey('Service', on_delete=models.CASCADE, related_name='process_steps')
    step_number = models.PositiveIntegerField()
    title = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        ordering = ['step_number']

class Service(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='services')
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    icon = models.CharField(max_length=10, blank=True)
    image = models.ImageField(upload_to='service_images/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    gallery = models.JSONField(default=list, blank=True)   # list of image URLs
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50, blank=True)  # e.g. "1-2 hrs"
    description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    includes = models.JSONField(default=list, blank=True)   # list of strings
    is_popular = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    # Aggregated stats (updated by signals)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.PositiveIntegerField(default=0)
    # Provider stats (stored as JSON for flexibility)
    provider_stats = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'services'
        ordering = ['-is_popular', 'title']

    def __str__(self):
        return self.title

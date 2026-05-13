from rest_framework import serializers
from .models import Category, Service, ServiceFAQ, ServiceProcessStep

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'slug', 'label', 'icon', 'image_url', 'is_active', 'sort_order']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = ['id', 'question', 'answer', 'sort_order']

class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProcessStep
        fields = ['step_number', 'title', 'description']

class ServiceListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    class Meta:
        model = Service
        fields = ['id', 'category', 'category_slug', 'title', 'subtitle', 'icon', 'image_url', 'price', 'duration', 'rating', 'review_count', 'is_popular', 'badge', 'description']

class ServiceDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    process = ProcessStepSerializer(many=True, source='process_steps', read_only=True)
    class Meta:
        model = Service
        fields = '__all__'

class AdminServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

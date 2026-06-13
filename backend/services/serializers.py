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

def resolve_image_url(instance, request=None):
    url = None
    if instance.image:
        url = instance.image.url
    elif instance.image_url:
        url = instance.image_url
    if url and request:
        return request.build_absolute_uri(url)
    return url

class ServiceListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = ['id', 'category', 'category_slug', 'title', 'subtitle', 'icon', 'image_url', 'price', 'duration', 'rating', 'review_count', 'is_popular', 'badge', 'description', 'includes']

    def get_image_url(self, obj):
        return resolve_image_url(obj, self.context.get('request'))

class ServiceDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    process = ProcessStepSerializer(many=True, source='process_steps', read_only=True)
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = '__all__'

    def get_image_url(self, obj):
        return resolve_image_url(obj, self.context.get('request'))

class AdminServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['image_url']

    def to_internal_value(self, data):
        if hasattr(data, 'dict'):
            data = data.dict()
        for json_field in ['includes', 'gallery', 'provider_stats']:
            if isinstance(data.get(json_field), str):
                import json
                try:
                    data[json_field] = json.loads(data[json_field])
                except (json.JSONDecodeError, TypeError):
                    pass
        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image:
            data['image_url'] = request.build_absolute_uri(instance.image.url) if request else instance.image.url
        return data

from rest_framework import serializers
from .models import ProviderApplication, ProviderEarning
from users.serializers import UserSerializer

def absolute_file_urls(instance, data, request, fields):
    for field in fields:
        value = getattr(instance, field, None)
        if value:
            url = value.url
            data[field] = request.build_absolute_uri(url) if request else url
    return data

class ProviderApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProviderApplication
        fields = '__all__'
        read_only_fields = ['user', 'status', 'applied_at', 'total_jobs', 'total_earnings', 'average_rating']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return absolute_file_urls(instance, data, self.context.get('request'), ['avatar', 'nid_file'])

class ProviderApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ['full_name', 'phone', 'nid_number', 'address', 'experience_years', 'skills', 'bio', 'availability', 'nid_file', 'avatar']

    def to_internal_value(self, data):
        if hasattr(data, 'dict'):
            data = data.dict()
        if isinstance(data.get('skills'), str):
            import json
            try:
                data['skills'] = json.loads(data['skills'])
            except (json.JSONDecodeError, TypeError):
                pass
        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return absolute_file_urls(instance, data, self.context.get('request'), ['avatar', 'nid_file'])

    def create(self, validated_data):
        user = self.context['request'].user
        application = ProviderApplication.objects.create(user=user, **validated_data)
        return application

class AdminProviderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = ProviderApplication
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return absolute_file_urls(instance, data, self.context.get('request'), ['avatar', 'nid_file'])

class ProviderPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ['id', 'full_name', 'phone', 'skills', 'experience_years', 'bio', 'availability', 'total_jobs', 'total_earnings', 'average_rating', 'avatar']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return absolute_file_urls(instance, data, self.context.get('request'), ['avatar'])

class ProviderEarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderEarning
        fields = '__all__'

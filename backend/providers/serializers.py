from rest_framework import serializers
from .models import ProviderApplication, ProviderEarning
from users.serializers import UserSerializer

class ProviderApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProviderApplication
        fields = '__all__'
        read_only_fields = ['user', 'status', 'applied_at', 'total_jobs', 'total_earnings', 'average_rating']

class ProviderApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ['full_name', 'phone', 'nid_number', 'address', 'experience_years', 'skills', 'bio', 'availability', 'nid_file']

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

    def create(self, validated_data):
        user = self.context['request'].user
        application = ProviderApplication.objects.create(user=user, **validated_data)
        return application

class AdminProviderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = ProviderApplication
        fields = '__all__'

class ProviderEarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderEarning
        fields = '__all__'

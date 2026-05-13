from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'status', 'avatar', 'referral_code', 'date_joined']
        read_only_fields = ['id', 'role', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    referral_code_used = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'referral_code_used']

    def create(self, validated_data):
        referral_code_used = validated_data.pop('referral_code_used', '')
        import random, string
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        referred_by = None
        if referral_code_used:
            try:
                referred_by = User.objects.get(referral_code=referral_code_used)
            except User.DoesNotExist:
                pass
        user = User.objects.create_user(**validated_data, referral_code=code, referred_by=referred_by)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class AdminUserSerializer(serializers.ModelSerializer):
    total_bookings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'status', 'date_joined', 'total_bookings']

    def get_total_bookings(self, obj):
        return obj.bookings.count()

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=6)

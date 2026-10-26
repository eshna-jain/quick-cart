from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from quickcart.models import Coupon 

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        )
        extra_kwargs = {
            "email": {"read_only": True},
            "username": {"read_only": True}
        } 

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField(
        required=True, allow_blank=False, validators=[
            UniqueValidator(queryset = User.objects.all(),
                            message='A user with this email already exists.')
        ]
    )
    password = serializers.CharField(
        write_only=True, validators = [
            validate_password
        ]
    )

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']

        )
        Coupon.objects.create(
            user=user,
            code=f"WELCOME{user.id}",
            discount=10.00
        )
        return user
            

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials.")
    


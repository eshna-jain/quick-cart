from django.contrib.auth import get_user_model

from rest_framework import generics, permissions
from rest_framework.request import Request
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# Create your views here.

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "coupon_code": user.coupons.filter(is_used=False).values_list('code', flat=True).first(),
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
                
            }
        )

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [
        permissions.AllowAny,
    ] 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
            }
        )

class UserAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        # since we are request user, we don't need to use custom permission_classes
        return self.request.user

    def put(self, request: Request) -> Response:
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

from django.urls import path

#simple jwt
from rest_framework_simplejwt.views  import TokenBlacklistView, TokenRefreshView

from .views import (
    LoginAPI,
    RegisterAPI,
    UserAPI,
)

app_name = "accounts-api"

urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),

    path('users/me/', UserAPI.as_view(), name='user'),

    path('token/refresh/', TokenRefreshView.as_view()),
]
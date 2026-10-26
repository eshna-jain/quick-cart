from django.urls import path, include
from . import views

urlpatterns = [
    path('products/', views.get_products),
    path('products/<int:pk>/', views.get_product),
    path('categories/', views.get_categories),
    path('cart/', views.get_cart),
    path('cart/add/', views.add_to_cart),
    path('cart/remove/', views.remove_from_cart),
    path('cart/update/', views.update_cart_quantity),
    path('orders/create/', views.create_order),
    path('orders/', views.get_orders),
    path('products/<int:pk>/reviews/', views.product_reviews),
    path('reviews/<int:pk>/', views.review_detail),
    path('coupon/', views.get_my_coupon),
]

# urlpatterns += [
#     path('v2/', include('quickcart.api_urls'))
# ]
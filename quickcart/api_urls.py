from django.urls import path
from .apis import (ProductListView, CategoryListView, ProductDetailView, CartListView, AddToCartView,
RemoveCartItemView, UpdateCartQuantityView, CreateOrderView, OrderListView, ProductReviewView,
ReviewDetailView,
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='get_products'),
    path('categories/', CategoryListView.as_view(), name='get_categories'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='get_product'),
    path('cart/', CartListView.as_view(), name='get_cart'),
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/remove/', RemoveCartItemView.as_view(), name='remove_from_cart'),
    path('cart/update/', UpdateCartQuantityView.as_view(), name='update_cart_quantity'),
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('orders/', OrderListView.as_view(), name='get_orders'),
    path('products/<int:pk>/reviews/', ProductReviewView.as_view(), name='product_reviews'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
]
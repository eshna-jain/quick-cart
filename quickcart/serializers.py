from rest_framework import serializers
from .models import Product, Category, CartItem, Order, OrderItem, Review
from django.db.models import Avg

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
             'name'
        ]

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    def get_average_rating(self, obj):
            average = obj.review_set.aggregate(Avg('rating'))['rating__avg']
            return round(average, 1) if average else 0
    
    def get_review_count(self, obj):
            return obj.review_set.count()
    

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'title',
            'description',
            'price',
            'image',
            'average_rating',
            'review_count'
        ]

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_title',
            'product_price',
            'product_image',
            'quantity',
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_title',
            'product_image',
            'price',
            'quantity',
            'product',
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = [
            'id',
            'created_at',
            'is_paid',
            'total_cost',
            'items',
            'payment_method',
            'original_total',
            'discount_amount',
            'coupon_applied'
        ] 

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'username',
            'rating',
            'created_at',
            'comment',
            'user_id',
            'is_edited',
        ]
from decimal import Decimal
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Product, CartItem, Order, OrderItem, Review
from .serializers import CategorySerializer, ProductSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, ReviewSerializer

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

class CartListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Product not found.'}, status=404)
        item, created = CartItem.objects.get_or_create(user=request.user, product=product, defaults={'quantity': 1})
        if not created:
            item.quantity += 1
            item.save()
        return Response({'message': 'Product added to cart.', 'item': CartItemSerializer(item).data}, status=201 if created else 200)

class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.data.get('item_id')
        item = CartItem.objects.filter(id=item_id, user=request.user).first()
        if not item:
            return Response({'error': 'Cart item not found.'}, status=404)
        item.delete()
        return Response({'message': 'Item removed from the cart.'})

class UpdateCartQuantityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        if not item_id or quantity is None:
            return Response({'error': 'Item ID and quantity are required.'}, status=400)
        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response({'error': 'Quantity must be a whole number.'}, status=400)
        item = CartItem.objects.filter(id=item_id, user=request.user).first()
        if not item:
            return Response({'error': 'Cart item not found.'}, status=404)
        if quantity < 1:
            item.delete()
            return Response({'message': 'Item removed.'})
        item.quantity = quantity
        item.save()
        return Response(CartItemSerializer(item).data)

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=400)
        payment_method = request.data.get('payment_method', 'COD')
        if payment_method not in ['COD', 'CC', 'PP']:
            return Response({'error': 'Invalid payment method.'}, status=400)
        total = sum((item.product.price * item.quantity for item in cart_items), Decimal('0.00'))
        with transaction.atomic():
            order = Order.objects.create(user=request.user, total_cost=total, payment_method=payment_method)
            OrderItem.objects.bulk_create([OrderItem(order=order, product=item.product, quantity=item.quantity, price=item.product.price) for item in cart_items])
            cart_items.delete()
        return Response({'message': 'Order placed successfully.', 'order_id': order.id, 'total_cost': str(total), 'payment_method': order.payment_method}, status=201)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class ProductReviewView(APIView):
    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)
        reviews = Review.objects.filter(product=product).order_by('-created_at')
        return Response(ReviewSerializer(reviews, many=True).data)

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({'error': 'You have already reviewed this product.'}, status=400)
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')
        try:
            rating = int(rating)
        except (ValueError, TypeError):
            return Response({'error': 'A valid rating is required.'}, status=400)
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)
        review = Review.objects.create(user=request.user, product=product, rating=rating, comment=comment)
        return Response(ReviewSerializer(review).data, status=201)

class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            review = Review.objects.get(id=pk)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found.'}, status=404)
        if review.user != request.user:
            return Response({'error': 'You can only modify your own review.'}, status=403)
        rating = request.data.get('rating')
        try:
            rating = int(rating)
        except (ValueError, TypeError):
            return Response({'error': 'A valid rating is required.'}, status=400)
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)
        review.rating = rating
        review.comment = request.data.get('comment', '')
        review.is_edited = True
        review.save()
        return Response(ReviewSerializer(review).data)

    def delete(self, request, pk):
        try:
            review = Review.objects.get(id=pk)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found.'}, status=404)
        if review.user != request.user:
            return Response({'error': 'You can only modify your own review.'}, status=403)
        review.delete()
        return Response({'message': 'Review deleted successfully.'})
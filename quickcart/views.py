from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Category, Product, CartItem, Order, OrderItem, Review, Coupon
from .serializers import CategorySerializer, ProductSerializer, CartItemSerializer, OrderSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from django.db import transaction
from django.conf import settings


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context = {'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    serializer = CartItemSerializer(cart_items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=404)

    item, created = CartItem.objects.get_or_create(user=request.user,
            product=product, defaults={'quantity': 1})
    if not created:
        item.quantity +=1
        item.save()

    return Response({'message': 'Product added to cart', 'item':CartItemSerializer(item).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request): 
    item_id = request.data.get('item_id')
    item = CartItem.objects.filter(id=item_id, user=request.user).first()

    if not item:
        return Response({'error': 'Cart item not found.'},
                        status=404)
    item.delete()

    return Response({'message': 'Item removed from the cart.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response(
            {'error': 'Item ID or quantity is required.'},status=400
        )

    try:
        item = CartItem.objects.get(
            id=item_id, user=request.user
        )

        if int(quantity) < 1:
            item.delete()
            return Response({'messsage': 'Item removed.'})
        item.quantity = quantity
        item.save()

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    
    except CartItem.DoesNotExist:
        return Response({'message': 'Cart item not found.'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_items = CartItem.objects.filter(user=request.user)

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)
    total = sum((item.product.price * item.quantity for item in cart_items),Decimal('0.00'))

    with transaction.atomic():
        order = Order.objects.create(user=request.user, total_cost=total)

        for item in cart_items:
            OrderItem.objects.create(order=order,
                                     product=item.product, quantity=item.quantity, price=item.product.price)
        cart_items.delete()

    return Response({'message': 'Order placed successfully.',
                     'order_id': order.id,
                     'total_cost': str(total),}, status=201)
            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    print("CURRENT USER:", request.user)
    print("CURRENT UsER ID:", request.user.id)

    order = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(order, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def product_reviews(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found.'},
            status=404)
    if request.method == 'GET':
        reviews = Review.objects.filter(
            product=product
        ).order_by('-created_at')

        serializer = ReviewSerializer(
            reviews,
            many=True)

        return Response(serializer.data)

    if not request.user.is_authenticated:
        return Response(
            {'error': 'You must be logged in to write a review.'},
            status=401
        )

    if Review.objects.filter(user=request.user,
                             product=product).exists():
        return Response({'error': 'You have already reviewed this product.'})

    rating = request.data.get('rating')
    comment = request.data.get('comment', '')

    if not rating:
        return Response(
            {'error': 'Rating is required.'},
            status=400
        )

    try:
        rating = int(rating)
    except (ValueError, TypeError):
        return Response(
            {'error': 'Rating must be a number.'},
            status=400
        )

    if rating < 1 or rating > 5:
        return Response(
            {'error': 'Rating must be between 1 and 5.'},
            status=400
        )

    review = Review.objects.create(
        user=request.user,
        product=product,
        rating=rating,
        comment=comment
    )

    serializer = ReviewSerializer(review)

    return Response(
        serializer.data,
        status=201
    )

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def review_detail(request, pk):
    try:
        review = Review.objects.get(id=pk)
    except Review.DoesNotExist:
        return Response({'error': 'Review not found.'}, status=404)

    if review.user != request.user:
        return Response({'error': 'You can only modify your own review.'}, status=403)

    if request.method == 'PUT':
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')
        if not rating:
            return Response({'error': 'Rating is required.'}, status=400)
        try:
            rating = int(rating)
        except (ValueError, TypeError):
            return Response({'error': 'Rating must be a number.'}, status=400)
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)
        review.rating = rating
        review.comment = comment
        review.is_edited = True
        review.save()
        return Response(ReviewSerializer(review).data, status=200)

    review.delete()
    return Response({'message': 'Review deleted successfully.'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    payment_method = request.data.get('payment_method', 'COD')
    if payment_method not in ['COD', 'CC', 'PP']:
        return Response({'error': 'Invalid payment method'}, status=400)

    total = sum(
        (item.product.price * item.quantity for item in cart_items),
        Decimal('0.00')
    )

    coupon_code = request.data.get('coupon_code', '').strip().upper()
    discount_amount = Decimal('0.00')
    coupon = None

    if coupon_code:
        coupon = Coupon.objects.filter(
            user=request.user,
            code__iexact=coupon_code,
            is_used=False
        ).first()

        if not coupon:
            return Response({'error': 'Invalid or already used coupon.'}, status=400)

        inr_per_usd = Decimal(str(settings.INR_PER_USD))
        minimum_usd = Decimal('700.00') / inr_per_usd

        if total < minimum_usd:
            return Response({
                'error': 'Your order must meet the minimum spend equivalent to ₹700.'
            }, status=400)

        discount_amount = (
            total * coupon.discount / Decimal('100')
        ).quantize(Decimal('0.01'))
        total -= discount_amount

    with transaction.atomic():
        order = Order.objects.create(
            user=request.user,
            original_total=total + discount_amount,
            discount_amount=discount_amount,
            coupon_applied = bool(coupon),
            total_cost = total,
            payment_method=payment_method
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        if coupon:
            coupon.is_used = True
            coupon.save(update_fields=['is_used'])

        cart_items.delete()

    return Response({
        'message': 'Order placed successfully.',
        'order_id': order.id,
        'total_cost': str(total),
        'discount_amount': str(discount_amount),
        'payment_method': order.payment_method
    }, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_coupon(request):
    coupon = Coupon.objects.filter(user=request.user,
                                   is_used=False).first()
    if not coupon:
        return Response({'coupon': None})
    return Response({
        'coupon': {
            'code': coupon.code,
            'discount': coupon.discount
        }
    })









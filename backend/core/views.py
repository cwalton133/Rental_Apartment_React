import json
from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from rest_framework.decorators import action
from django.views import View
from rest_framework.views import APIView 
from django.contrib.auth.decorators import login_required
from django_filters.rest_framework import  DjangoFilterBackend
from django.db.models import Count, Avg
import requests
import stripe
from userauths.models import User
from core.models import Property, Booking, PropertyReview, Wishlist, Address, Payment
from core.forms import PropertyReviewForm
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    PropertyCategory,
    Realtor,
    Property,
    Booking,
    PropertyReview,
    Wishlist,
    Address,
    Amenity,
    PropertyImages,
    Payment,
)
from .serializers import (
    PropertyCategorySerializer,
    RealtorSerializer,
    PropertySerializer,
    BookingSerializer,
    PropertyReviewSerializer,
    WishlistSerializer,
    AddressSerializer,
    AmenitySerializer,
    PropertyImagesSerializer,
    PaymentSerializer,
)
from django.template.loader import get_template, TemplateDoesNotExist
from .serializers import PaymentSerializer
from .payments.paypal import initiate_paypal_payment
from .payments.paystack import initiate_paystack_payment
from .payments.credit_card import initiate_stripe_payment
from paystackapi.transaction import Transaction 
from django.middleware.csrf import get_token
import hmac
import hashlib
from datetime import datetime
#import paypalrestsdk



def property_list_view(request):
    try:
        template = get_template('core/property-list.html')  
        return render(request, 'core/property-list.html')  
    except TemplateDoesNotExist:
        return HttpResponse("Template does not exist.")


def index(request):
    properties = Property.objects.filter(available=True, featured=True).order_by("-date_added")
    context = {
        "properties": properties
    }
    return render(request, 'core/index.html', context)


def property_list_view(request):
    properties = Property.objects.filter(available=True).order_by("-date_added")
    context = {
        "properties": properties,
    }
    return render(request, 'core/property-list.html', context)


def property_detail_view(request, pid):
    property = get_object_or_404(Property, pid=pid)
    reviews = PropertyReview.objects.filter(property=property).order_by("-date")
    average_rating = PropertyReview.objects.filter(property=property).aggregate(rating=Avg('rating'))

    review_form = PropertyReviewForm()

    make_review = True
    if request.user.is_authenticated:
        user_review_count = PropertyReview.objects.filter(user=request.user, property=property).count()
        if user_review_count > 0:
            make_review = False

    context = {
        "property": property,
        "make_review": make_review,
        "review_form": review_form,
        "average_rating": average_rating,
        "reviews": reviews,
    }
    return render(request, "core/property-detail.html", context)


# @login_required
# def book_property(request, pid):
#     if request.method == "POST":
#         property = get_object_or_404(Property, pid=pid)
#         check_in_date = request.POST.get("check_in")
#         check_out_date = request.POST.get("check_out")
#         guests = request.POST.get("guests")

#         booking = Booking.objects.create(
#             user=request.user,
#             property=property,
#             check_in_date=check_in_date,
#             check_out_date=check_out_date,
#             guests=guests,
#         )

#         messages.success(request, "Booking successful!")
#         return redirect('core:booking_detail', booking.id)
#     return render(request, "core/book_property.html", {"property_id": pid})

@login_required
def book_property(request, pid):
    property = get_object_or_404(Property, pid=pid)

    if request.method == "POST":
        check_in_str = request.POST.get("check_in")
        check_out_str = request.POST.get("check_out")

        check_in_date = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out_date = datetime.strptime(check_out_str, '%Y-%m-%d').date()
        
        total_days = (check_out_date - check_in_date).days

        if total_days <= 0:
            return render(request, "core/book_property.html", {
                "property_id": pid,
                "error": "The check-out date must be after the check-in date."
            })

        total_price = property.price_per_day * total_days

        # Create the booking
        booking = Booking.objects.create(
            user=request.user,
            property=property,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            guests=request.POST.get("guests"),
            total_price=total_price,  
        )

        # Create the transaction with a placeholder status
        payment = Payment.objects.create(
            booking=booking,
            reference="REF" + str(booking.id),  
            amount=total_price,
            status="pending"  
        )

        # Redirect to payment with transaction ID
        return redirect('payment', booking_id=booking.id, payment_id=payment.id)

    return render(request, "core/book_property.html", {"property_id": pid})



@login_required
def booking_detail(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    return render(request, "core/booking_detail.html", {"booking": booking})


@login_required
def add_property_review(request, pid):
    if request.method == "POST":
        property = get_object_or_404(Property, pid=pid)
        review_form = PropertyReviewForm(request.POST)
        if review_form.is_valid():
            PropertyReview.objects.create(
                user=request.user,
                property=property,
                review=review_form.cleaned_data['review'],
                rating=review_form.cleaned_data['rating'],
            )
            messages.success(request, "Review added successfully!")
        else:
            messages.error(request, "There was an error adding your review.")
        return redirect("core:property_detail", pid=pid)


@login_required
def wishlist_view(request):
    wishlist = Wishlist.objects.filter(user=request.user)
    context = {
        "wishlist": wishlist,
    }
    return render(request, "core/wishlist.html", context)

@login_required
def add_to_wishlist(request):
    pid = request.GET['id']
    property = get_object_or_404(Property, pid=pid)
    Wishlist.objects.get_or_create(user=request.user, property=property)
    return JsonResponse({"success": True})

@login_required
def remove_from_wishlist(request):
    pid = request.GET['id']
    wishlist_item = Wishlist.objects.filter(user=request.user, property__pid=pid).first()
    if wishlist_item:
        wishlist_item.delete()
    return JsonResponse({"success": True})


@login_required
def user_dashboard(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-check_in_date")
    context = {
        "bookings": bookings,
    }
    return render(request, 'core/dashboard.html', context)


@login_required
def make_address_default(request):
    id = request.GET['id']
    Address.objects.update(status=False)
    Address.objects.filter(id=id).update(status=True)
    return JsonResponse({"boolean": True})


def search_view(request):
    query = request.GET.get("q", "")
    properties = Property.objects.filter(title__icontains=query, available=True).order_by("-date_added")
    context = {
        "properties": properties,
        "query": query,
    }
    return render(request, "core/search.html", context)



# My Other Pages
def contact(request):
    return render(request, "core/contact.html")


def about_us(request):
    return render(request, "core/about_us.html")


def privacy_policy(request):
    return render(request, "core/privacy_policy.html")


def terms_of_service(request):
    return render(request, "core/terms_of_service.html")


#==========My ViesSet for Serializers==================


class PropertyCategoryViewSet(viewsets.ModelViewSet):
    queryset = PropertyCategory.objects.all()
    serializer_class = PropertyCategorySerializer
    #permission_classes = [IsAuthenticated] 
    permission_classes = []


    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.properties.exists():
            return Response({'error': 'Cannot delete this category because it is associated with properties.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RealtorViewSet(viewsets.ModelViewSet):
    queryset = Realtor.objects.all()
    serializer_class = RealtorSerializer
    permission_classes = [IsAuthenticated]  

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.properties.exists():
            return Response({'error': 'Cannot delete this realtor because they are associated with properties.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    #permission_classes = [AllowAny]  
    #permission_classes = [IsAuthenticated]  


    def get_queryset(self):
        queryset = Property.objects.all()
        location = self.request.query_params.get("location")
        min_price = self.request.query_params.get("minPrice")
        max_price = self.request.query_params.get("maxPrice")
        bedrooms = self.request.query_params.get("bedrooms")
        amenities = self.request.query_params.get("amenities")

        if location:
            queryset = queryset.filter(location__icontains=location)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if bedrooms:
            queryset = queryset.filter(bedrooms=bedrooms)
        if amenities:
            queryset = queryset.filter(amenities__name__in=amenities.split(","))

        return queryset


    
# class BookingViewSet(viewsets.ModelViewSet):
#     queryset = Booking.objects.all()
#     serializer_class = BookingSerializer
#     permission_classes = [IsAuthenticated]  

#     def get_serializer_context(self):
#         return {'request': self.request}

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]  

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        # Extract the required fields from the request data
        check_in_str = request.data.get("check_in")
        check_out_str = request.data.get("check_out")
        property_id = request.data.get("property_id")  
        guests = request.data.get("guests")

        # Convert date strings to date objects
        check_in_date = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out_date = datetime.strptime(check_out_str, '%Y-%m-%d').date()

        # Calculate the number of days booked
        total_days = (check_out_date - check_in_date).days

        if total_days <= 0:
            return Response({"error": "The check-out date must be after the check-in date."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the property and price
        property = get_object_or_404(Property, id=property_id)
        total_price = property.price_per_day * total_days

        # Create the booking
        booking = Booking.objects.create(
            user=request.user,
            property=property,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            guests=guests,
            total_price=total_price,
        )

        # Create the payment
        payment = Payment.objects.create(
            booking=booking,
            amount=total_price,
            status="pending",  
            reference="REF" + str(booking.id)  
        )

        # Build the response including redirect URLs
        response_data = {
            "booking_id": booking.id,
            "payment_id": payment.id,
            "payment_url": f"{request.build_absolute_uri('/payment/')}/{payment.id}",
            "cancel_url": f"{request.build_absolute_uri('/cancel/')}/{booking.id}"
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    

class PropertyReviewViewSet(viewsets.ModelViewSet):
    queryset = PropertyReview.objects.all()
    serializer_class = PropertyReviewSerializer
    permission_classes = [IsAuthenticated] 

    def get_serializer_context(self):
        return {'request': self.request}


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated] 

    def get_serializer_context(self):
        return {'request': self.request}


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated] 

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated] 

    def get_serializer_context(self):
        return {'request': self.request}


class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImages.objects.all()
    serializer_class = PropertyImagesSerializer
    #permission_classes = [IsAuthenticated] 

    # def get_serializer_context(self):
    #     return {'request': self.request}

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get_queryset(self):
        property_id = self.request.query_params.get("property")
        if property_id:
            return PropertyImages.objects.filter(property_id=property_id)
        return PropertyImages.objects.all()
    
#===============Payment Method Initiate==============
# class PaymentViewSet(viewsets.ModelViewSet):
#     queryset = Payment.objects.all()
#     serializer_class = PaymentSerializer
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['booking']
#     permission_classes = [AllowAny]
    
# def get_csrf_token(request):
#     return JsonResponse({"csrfToken": get_token(request)})

# @login_required
# def initiate_payment(request, booking_id):
#     booking = get_object_or_404(Booking, id=booking_id, user=request.user)
#     payment_method = request.POST.get("payment_method")
#     amount = booking.property.price
    
#     if payment_method == "paypal":
#         return initiate_paypal_payment(request, booking, amount)
#     elif payment_method == "paystack":
#         return initiate_paystack_payment(request.user.email, amount)
#     elif payment_method == "credit_card":
#         return initiate_stripe_payment(request, amount)
#     else:
#         return JsonResponse({"error": "Invalid payment method selected."}, status=400)  
    

# class PaystackPayment(View):
#     def post(self, request):
#         amount = request.POST.get("amount")  
#         email = request.POST.get("email")
#         response = Transaction.initialize(data={
#             'amount': amount,
#             'email': email,
#         })
#         return JsonResponse(response)
    
# @csrf_exempt
# def paystack_webhook(request):
#     if request.method == "POST":
#         secret_key = settings.PAYSTACK_SECRET_KEY.encode('utf-8')
#         signature = request.headers.get("x-paystack-signature")

#         payload = request.body
#         computed_signature = hmac.new(secret_key, payload, hashlib.sha512).hexdigest()

#         if signature == computed_signature:  
#             event = json.loads(payload)
#             if event['event'] == "charge.success":
#                 # Extract necessary data
#                 data = event['data']
#                 reference = data['reference']
#                 status = data['status']
#                 amount = data['amount'] / 100  

#                 # Update transaction in database
#                 try:
#                     payment = Payment.objects.get(reference=reference)
#                     payment.status = "paid" if status == "success" else "failed"
#                     payment.save()
#                 except Payment.DoesNotExist:
#                     return JsonResponse({"error": "Payment not found"}, status=400)

#                 return JsonResponse({"message": "Payment verified successfully"}, status=200)

#         return JsonResponse({"error": "Invalid signature"}, status=400)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

# class TransferAction(APIView):
#     def post(self, request):
#         # Deserialize incoming data
#         serializer = TransferSerializer(data=request.data)
#         # Check if the serializer is valid
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             if user:
#                 data = User.objects.filter(email=user).first()
#                 if data:
#                     wallet = Wallet.objects.filter(user=data).first()
#                     if wallet:
#                         balance = wallet.balance  # Keep it as Decimal
#                         amount = serializer.validated_data['amount']
#                         description = serializer.validated_data['description']
#                         bank_code = serializer.validated_data['bank_code']
#                         account_number = serializer.validated_data['account_number']
#                         account_name = serializer.validated_data['account_name']

#                         # Generate recipient
#                         rcpt = generateRescipient(
#                             accName=account_name,
#                             accNo=account_number,
#                             bankCode=bank_code
#                         )
#                         print(rcpt)
#                         # Perform the transfer
#                         transfer_response = transfer(
#                             balance=balance,
#                             amount=amount,
#                             description=description,
#                             rcpt=rcpt
#                         )


#                         return Response(
#                             {"error": "Transfer failed", "details": transfer_response},
#                             status=status.HTTP_400_BAD_REQUEST
#                         )
                        
     
#     @action(detail=False, methods=["get"])
#     def success(self, request):
#         return Response({"success": True, "message": "Payment was successful."}, status=200)

#     @action(detail=False, methods=["get"])
#     def failure(self, request):
#         return Response({"success": False, "message": "Payment failed. Please try again."}, status=400)
                   
                        
# #Paymant Successful and Failure with HTML Template

# @csrf_exempt
# @require_GET
# def verify_payment(request):
#     transaction_id = request.GET.get("transaction_id")
#     if not transaction_id:
#         return JsonResponse({"success": False, "error": "Transaction ID missing"}, status=400)

#     try:
#         headers = {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"}
#         response = requests.get(f"https://api.paystack.co/transaction/verify/{transaction_id}", headers=headers)
#         data = response.json()

#         if data.get("status") and data.get("data", {}).get("status") == "success":
#             amount = data["data"]["amount"] / 100  # Paystack sends amount in kobo
#             reference = data["data"]["reference"]

#             # ✅ Update Payment Record in Database
#             payment = Payment.objects.filter(transaction_id=reference).first()
#             if payment:
#                 payment.status = "completed"
#                 payment.save()
#             else:
#                 return JsonResponse({"success": False, "error": "Payment record not found"}, status=404)

#             return JsonResponse({"success": True, "message": "Payment verified successfully"})

#         return JsonResponse({"success": False, "error": "Payment verification failed"}, status=400)

#     except requests.RequestException as e:
#         return JsonResponse({"success": False, "error": f"Payment gateway error: {str(e)}"}, status=500)
    
# def payment_success(request):
#     return render(request, "payments/payment_success.html")

# def payment_failure(request):
#     return render(request, "payments/payment_failure.html")


#==============================================

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    #permission_classes = [AllowAny]
    permission_classes = [IsAuthenticated]  


    def create(self, request, *args, **kwargs):
        booking_id = request.data.get("booking_id")
        return initiate_payment(request, booking_id)

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

@login_required
def initiate_payment(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    payment_method = request.POST.get("payment_method")
    amount = booking.total_price  # Assuming the total price is stored in the booking

    if payment_method == "paypal":
        return paypal.initiate_payment(request, booking, amount)
    elif payment_method == "paystack":
        return paystack.initiate_payment(request.user.email, amount)
    elif payment_method == "credit_card":
        return credit_card.initiate_payment(request, amount)  # Implement this in your credit_card.py
    else:
        return JsonResponse({"error": "Invalid payment method selected."}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class PaystackPayment(View):
    def post(self, request):
        amount = request.POST.get("amount")
        email = request.POST.get("email")
        response = Transaction.initialize(data={
            'amount': amount,
            'email': email,
        })
        return JsonResponse(response)

@csrf_exempt
def paystack_webhook(request):
    if request.method == "POST":
        secret_key = settings.PAYSTACK_SECRET_KEY.encode('utf-8')
        signature = request.headers.get("x-paystack-signature")
        payload = request.body
        computed_signature = hmac.new(secret_key, payload, hashlib.sha512).hexdigest()

        if signature == computed_signature:
            event = json.loads(payload)
            if event['event'] == "charge.success":
                data = event['data']
                reference = data['reference']
                status = data['status']
                amount = data['amount'] / 100  # Convert kobo to naira

                # Update payment record
                try:
                    payment = Payment.objects.get(reference=reference)
                    payment.status = "paid" if status == "success" else "failed"
                    payment.save()
                except Payment.DoesNotExist:
                    return JsonResponse({"error": "Payment not found"}, status=404)

                return JsonResponse({"message": "Payment verified successfully"}, status=200)

        return JsonResponse({"error": "Invalid signature"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def payment_success(request):
    return render(request, "payments/payment_success.html")

def payment_failure(request):
    return render(request, "payments/payment_failure.html")

# Verify payment for Paystack and update the Payment status
@csrf_exempt
@require_GET
def verify_payment(request):
    transaction_id = request.GET.get("transaction_id")
    if not transaction_id:
        return JsonResponse({"success": False, "error": "Transaction ID missing"}, status=400)

    # Call Paystack's verify endpoint
    try:
        headers = {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"}
        response = requests.get(f"https://api.paystack.co/transaction/verify/{transaction_id}", headers=headers)
        data = response.json()

        if data.get("status") and data.get("data", {}).get("status") == "success":
            reference = data["data"]["reference"]

            # Update the Payment record in the database
            payment = Payment.objects.filter(reference=reference).first()
            if payment:
                payment.status = "completed"
                payment.save()
            else:
                return JsonResponse({"success": False, "error": "Payment record not found"}, status=404)

            return JsonResponse({"success": True, "message": "Payment verified successfully"})

        return JsonResponse({"success": False, "error": "Payment verification failed"}, status=400)

    except requests.RequestException as e:
        return JsonResponse({"success": False, "error": f"Payment gateway error: {str(e)}"}, status=500)
from django.shortcuts import redirect, render, get_object_or_404
from userauths.forms import UserRegisterForm, ProfileForm
from django.contrib.auth import get_user_model, login, authenticate, logout
from django.contrib import messages
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from userauths.serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    ProfileSerializer,
    ContactUsSerializer,
)
from userauths.models import Profile, User, ContactUs


User = get_user_model()


def register_view(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST or None)
        if form.is_valid():
            new_user = form.save()
            username = form.cleaned_data.get("username")
            messages.success(request, f"Hey {username}, You account was created successfully.")
            new_user = authenticate(username=form.cleaned_data['email'],
                                    password=form.cleaned_data['password1']
                                    )
            login(request, new_user)

            next_url = request.GET.get("next", 'core:index')
            return redirect(next_url)
    else:
        form = UserRegisterForm()

    context = {
        'form': form,
    }
    return render(request, "userauths/sign-up.html", context)


# def login_view(request):
#     if request.user.is_authenticated:
#         messages.warning(request, f"Hey you are already Logged In.")
#         return redirect("core:index")

#     if request.method == "POST":
#         email = request.POST.get("email")
#         password = request.POST.get("password")

#         try:
#             user = User.objects.get(email=email)
#             user = authenticate(request, email=email, password=password)

#             if user is not None:
#                 login(request, user)
#                 messages.success(request, "You are logged in.")
#                 next_url = request.GET.get("next", 'core:index')
#                 return redirect(next_url)
#             else:
#                 messages.warning(request, "User Does Not Exist, create an account.")

#         except:
#             messages.warning(request, f"User with {email} does not exist")

#     return render(request, "userauths/sign-in.html")


def login_view(request):
    # Check if the user is already authenticated
    if request.user.is_authenticated:
        messages.warning(request, "Hey you are already logged in.")
        return redirect("core:index")

    # Handle POST request for login
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            # Authenticate user based on email and password.
            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                messages.success(request, "You are logged in.")
                next_url = request.GET.get("next", 'core:index')  # Default to core:index if no next param
                return redirect(next_url)
            else:
                messages.warning(request, "Invalid credentials. Please try again.")

        except User.DoesNotExist:
            messages.warning(request, f"User with {email} does not exist.")
        except Exception as e:
            messages.error(request, "An error occurred during login.")

    # Render sign-in form
    return render(request, "userauths/sign-in.html")


def logout_view(request):
    logout(request)
    messages.success(request, "You logged out.")
    return redirect("userauths:sign-in")


def profile_update(request):
    profile = Profile.objects.get(user=request.user)
    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            new_form = form.save(commit=False)
            new_form.user = request.user
            new_form.save()
            messages.success(request, "Profile Updated Successfully.")
            return redirect("core:dashboard")
    else:
        form = ProfileForm(instance=profile)

    context = {
        "form": form,
        "profile": profile,
    }

    return render(request, "userauths/profile-edit.html", context)


#========================My Serializers View =======================
# class UserRegisterView(generics.CreateAPIView):
#     serializer_class = UserRegisterSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         return Response({
#             'user': self.get_serializer(user).data,
#             'message': 'User registered successfully.'
#         }, status=status.HTTP_201_CREATED)


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()  
    serializer_class = UserRegisterSerializer
    authentication_classes = []  
    permission_classes = []       

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  
        user = serializer.save()  

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


# class UserLoginView(APIView):
#     def post(self, request):
#         serializer = UserLoginSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.validated_data['user']
#             self._authenticate_user(request, user)

#             token, _ = Token.objects.get_or_create(user=user)

#             return self._generate_success_response(token, user)

#     def _authenticate_user(self, request, user):
#         login(request, user)

#     def _generate_success_response(self, token, user):
#         return Response({
#             "token": token.key,
#             "user": {
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#             },
#             "message": "Login successful"
#         }, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    """
    API View for user login that handles authentication and token generation.
    """

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        # Validate the serializer, and if valid, proceed
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            self._authenticate_user(request, user)

            # Create or retrieve the authentication Token
            token, _ = Token.objects.get_or_create(user=user)

            # Generate a successful response with the token and user info
            return self._generate_success_response(token, user)

    def _authenticate_user(self, request, user):
        """
        Authenticate the user by logging them in.
        """
        login(request, user)

    def _generate_success_response(self, token, user):
        """
        Generate a response for successful login.
        """
        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "message": "Login successful"
        }, status=status.HTTP_200_OK)


        

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response({"id": request.user.id, "name": request.user.username, "email": request.user.email})



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # user's token
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ContactUsView(generics.CreateAPIView):
    serializer_class = ContactUsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_message = serializer.save()
        return Response({
            'message': 'Your message has been sent successfully.'
        }, status=status.HTTP_201_CREATED)

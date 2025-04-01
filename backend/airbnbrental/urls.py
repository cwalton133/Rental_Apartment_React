from django.contrib import admin
from django.urls import path, include,re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.middleware.csrf import get_token






schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

admin.site.site_header = 'AirBnb Rentals Admin'
admin.site.index_title = 'Admin'

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("core.urls")),
    path('', include('userauths.urls')),
    #path("useradmin/", include("useradmin.urls")),
    path('tinymce/', include('tinymce.urls')),
    #Drf-Yasg
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    #Payment Url
    path('paypal/', include('paypal.standard.ipn.urls')), 
    # ✅ Fix missing CSRF token
   path("api/csrf-token/", get_csrf_token),  

]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

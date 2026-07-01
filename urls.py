from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

def home(request):
    return HttpResponse("""
    <h1 style="color: green; text-align: center; margin-top: 50px;">
        🎉 Ashioon Project is Live!
    </h1>
    <p style="text-align: center; font-size: 18px;">
        Your Django backend is successfully deployed on Render.
    </p>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
]
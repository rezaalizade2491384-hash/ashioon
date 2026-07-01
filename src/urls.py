"""
URL configuration for ashioon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

# یک view ساده برای تست
def home(request):
    return HttpResponse("""
    <h1 style="color: green; text-align: center; margin-top: 50px;">
        🎉 Ashioon Project is Live!
    </h1>
    <p style="text-align: center; font-size: 18px;">
        Your Django backend is successfully deployed on Render.
    </p>
    <p style="text-align: center; font-size: 14px; color: gray;">
        API endpoints will be available here.
    </p>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
]
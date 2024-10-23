"""
URL configuration for user_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from user_management import views
# import debug_toolbar

urlpatterns = [
    # path('__debug__/', include(debug_toolbar.urls)),

    path('api/users/admin/', admin.site.urls),
    path('api/users/', include('user_management.urls')),

    path('api/auth/42/login/', views.fortytwo_login, name='fortytwo_login'),
    path('api/auth/42/callback/', views.fortytwo_callback, name='fortytwo_callback'),
]

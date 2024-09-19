from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/game/admin/', admin.site.urls),
    path('api/game/', include('game.urls')),  # Include the game API routes
]


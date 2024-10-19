from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/game/admin/', admin.site.urls),
    path('api/game/pingpong/', include('pingpong.urls')),  # Include the game API routes
    path('api/game/zombie_game/', include('zombie_game.urls')),  # Include the auth API routes
]


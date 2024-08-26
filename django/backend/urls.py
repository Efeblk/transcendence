from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),             # Admin interface
    path('game/', include('game.urls')),         # Include URLs from the game app
    path('', include('game.urls')),              # Optionally, make the game app the root path
]

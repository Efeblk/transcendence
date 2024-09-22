from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsersViewSet, profile_view, signup, login

#router = DefaultRouter()
#router.register(r'users', UsersViewSet)

#urlpatterns = router.urls
urlpatterns = [
    path('users-data/', UsersViewSet.as_view(), name='users-data-list'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('profile/', profile_view, name='profile'),
]
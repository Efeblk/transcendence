from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsersViewSet, signup, login, login_view, signup_view, search_people, user_profile, profile_view
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

#router = DefaultRouter()
#router.register(r'users', UsersViewSet)

#urlpatterns = router.urls
urlpatterns = [
    path('users-data/', UsersViewSet.as_view(), name='users-data-list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('rq_login/', login, name='rq_login'),
    path('login/', login_view, name='login'),
    path('rq_signup/', signup, name='rq_signup'),
    path('signup/', signup_view, name='signup'),
    path('profile/', profile_view, name='profile'),
    path('search/', search_people, name='search_people'),
    path('profile/<str:username>/', user_profile, name='user_profile'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
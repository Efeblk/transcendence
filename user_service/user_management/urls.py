from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsersViewSet, signup, login_, login_view, signup_view, search_people, user_profile, profile_view, search_view, add_friend, list_friend_requests, accept_friend_request, decline_friend_request, friends, unfriend_friend, edit_profile_view, edit_profile, logout, verify_2fa_view, check_2fa_code, login42, getuser, UsersViewSetOnline
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

#router = DefaultRouter()
#router.register(r'users', UsersViewSet)

#urlpatterns = router.urls
urlpatterns = [
    path('users-data/', UsersViewSet.as_view(), name='users-data-list'),
    path('users-data-online/', UsersViewSetOnline.as_view(), name='users-data-list-online'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getuser/', getuser, name='getuser'),
    path('rq_login/', login_, name='rq_login'),
    path('login42/', login42, name='login42'),
    path('login/', login_view, name='login'),
    path('rq_signup/', signup, name='rq_signup'),
    path('signup/', signup_view, name='signup'),
    path('profile/', profile_view, name='profile'),
    path('logout/', logout, name='logout'),
    path('edit_profile/', edit_profile_view, name='edit_profile'),
    path('rq_edit_profile/', edit_profile, name='rq_edit_profile'),
    path('search/', search_view, name='search'),
    path('rq_search/', search_people, name='rq_search'),
    path('profile/<str:username>/', user_profile, name='user_profile'),
    path('add_friend/', add_friend, name='add_friend'),
    path('friend_requests/', list_friend_requests, name='list_friend_requests'),
    path('friends/', friends, name='friends'),
    path('friendships/accept/<int:friend_id>/', accept_friend_request, name='accept_friend_request'),
    path('friendships/decline/<int:friend_id>/', decline_friend_request, name='decline_friend_request'),    
    path('friendships/unfriend/<int:friend_id>/', unfriend_friend, name='unfriend_friend'),
    path('verify-2fa/', verify_2fa_view, name='verify_2fa_view'),
    path('rq_verify-2fa/', check_2fa_code, name='rq_verify-2fa')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
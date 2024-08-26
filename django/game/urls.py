from django.urls import path
from django.shortcuts import render

urlpatterns = [
    path('test-bootstrap/', lambda request: render(request, 'game/test_bootstrap.html')),
]

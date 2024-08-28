from django.shortcuts import render, redirect

def pingpong_view(request):
    return render(request, 'game/pingpong.html')

def home_view(request):
    return render(request, 'game/index.html')  # Ensure 'index.html' exists in the 'templates/game/' directory

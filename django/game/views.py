from django.shortcuts import render

def pingpong_view(request):
    if request.headers.get('Hx-Request'):  # HTMX request check
        return render(request, 'game/pingpong.html')  # Partial
    return render(request, 'game/base.html')  # Full page load

def home_view(request):
    return render(request, 'game/index.html')
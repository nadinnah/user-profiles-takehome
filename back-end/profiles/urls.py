from django.urls import path
from .views import main

urlpatterns = [
    path('', main)
    #path('home',main) will get page not found unless i add /home in the url
]

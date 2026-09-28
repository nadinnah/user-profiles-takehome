from django.urls import path
from .views import UserView

urlpatterns = [
    path('home', UserView.as_view())
    #path('home',main) will get page not found unless i add /home in the url
]

from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UserView(generics.CreateAPIView): #post
    queryset= User.objects.all
    serializer_class= UserSerializer

#class UserView(generics.ListAPIView): #get list
#    queryset= User.objects.all
#    serializer_class= UserSerializer
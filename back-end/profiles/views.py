from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from .models import *
from .serializers import UserSerializer
from rest_framework.response import Response

class UserViewSet(viewsets.ViewSet): 
    permission_class= [permissions.AllowAny] #as long as they come from react front-end
    queryset= User.objects.all()
    serializer_class= UserSerializer

    def list(self,request): #get list
        queryset= User.objects.all()
        serializer= self.serializer_class(queryset, many=True) #many records can be added
        return Response(serializer.data) #get serialized data to front-end

    #def retrieve(self,request):
        
        

#class UserView(generics.ListAPIView): #get list
#    queryset= User.objects.all
#    serializer_class= UserSerializer
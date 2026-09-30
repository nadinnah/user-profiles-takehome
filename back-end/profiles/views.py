from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from .models import *
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import action


class UserViewSet(viewsets.ViewSet): 
    permission_classes= [permissions.AllowAny] #as long as they come from react front-end
    queryset= User.objects.all()
    serializer_class= UserSerializer


    @action(detail=False, methods=['post'], url_path='import')
    def import_users(self, request):
        rows = request.data
        if not isinstance(rows, list):
            return Response({"detail": "The JSON must be a list of users."}, status=400)

        imported, failed = [], []
        for i, row in enumerate(rows, start=1):
            serializer = UserSerializer(data=row)
            if serializer.is_valid():
                serializer.save()
                imported.append(serializer.data)
            else:
                failed.append({
                    "row": i,
                    "username": row.get("username") if isinstance(row, dict) else None,
                    "errors": serializer.errors,
                })

        return Response({
            "imported_count": len(imported),
            "failed_count": len(failed),
            "imported": imported,
            "failed": failed,
        })

    def list(self,request): #get list
        queryset= User.objects.all()
        serializer= self.serializer_class(queryset, many=True) #many records can be added
        return Response(serializer.data) #get serialized data to front-end

    def create(self,request):
        serializer= self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)#created
        else: 
            return Response(serializer.errors, status= 400)#bad request

    def retrieve(self, request, pk=None): #get one user
        user = get_object_or_404(User, pk=pk)#handles 404 if doesnt exist
        serializer = self.serializer_class(user)
        return Response(serializer.data, status=200)

    def update(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=True) #, context={'request': request} for image storage url for absolute paths 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=204) #no content
    
               

        
        

#class UserView(generics.ListAPIView): #get list
#    queryset= User.objects.all
#    serializer_class= UserSerializer
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields=('phone','gender','date_of_birth','job_title','department','city','country','bio','profile_image', 'hire_date', 'is_active','created_at','updated_at')

class UserSerializer(serializers.ModelSerializer):
    profile= UserProfileSerializer()

    class Meta:
        model=User
        fields=('id','username','email','first_name','last_name','profile')

    #needs fixing
    def create(self, validated_data): #overriding create() to support nested json otherwise will throw NotImplementedError
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data) #The ** syntax unpacks the dictionary key-value pairs into keyword arguments. ex: User.objects.create(username='ahmad.smith', email='ahmad.smith@example.com', ...)
        UserProfile.objects.create(user=user, **profile_data) #sets the foreign key / one-to-one link pointing to the user
        return user
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User
from django.db import transaction

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields=('phone','gender','date_of_birth','job_title','department','city','country','bio','profile_image', 'hire_date', 'is_active','created_at','updated_at')

class UserSerializer(serializers.ModelSerializer):
    profile= UserProfileSerializer()

    class Meta:
        model=User
        fields=('id','username','email','first_name','last_name','profile')

    def validate_email(self, value):
        qs = User.objects.filter(email__iexact=value)
        if self.instance:                     
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate_username(self, value):    
        qs = User.objects.filter(username__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        user.set_unusable_password()
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        return user

    @transaction.atomic
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        for attr in ('username', 'email', 'first_name', 'last_name'):
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])
        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance
from django.db import models
from django.contrib.auth.models import User
from PIL import Image,UnidentifiedImageError
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

def validate_phone_number(value):
    if value and not value.replace(" ", "").replace("+", "").isdigit():
        raise ValidationError("Phone number must contain only digits, spaces, or a leading '+' sign.")
    
def validate_image(image):
    try:
        with Image.open(image) as img:
            if img.format.lower() not in {"jpg", "jpeg", "png", "webp"}:
                raise ValidationError("Unsupported image format.")
            img.verify()
    except(UnidentifiedImageError,OSError):
        raise ValidationError("The uploaded file is not a valid image.")

GENDER_CHOICES={
    "male": "Male",
    "female":"Female"
}

#ADD VALIDATIONS
class UserProfile(models.Model):
    user= models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile") #extending the user model, cascade whenever user deleted the userprofile is also deleted
    phone= models.CharField(max_length=30, null=True,blank=True, validators=[validate_phone_number]) #optional, IntegerField() would drop 0 in the beginning, ex: 01151332456 would be 1151332456 so charfield
    gender= models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth= models.DateField()
    job_title=models.CharField(max_length=100)
    department=models.CharField(max_length=100)
    city=models.CharField(max_length=100)
    country=models.CharField(max_length=100)
    bio=models.TextField(max_length=300, null=True, blank=True) #optional
    profile_image=models.ImageField(null=True, blank=True, validators=[
        validate_image, FileExtensionValidator(["jpg", "jpeg", "png", "webp"])
    ],) #optional
    hire_date=models.DateField()
    is_active=models.BooleanField()
    created_at=models.DateTimeField(auto_now_add=True) #Automatically sets the field to the current date and time when the object is first created. 
    updated_at=models.DateTimeField(auto_now=True) #Automatically sets the field to the current date and time every time the object is saved.

    def __str__(self): #what's shown when printed
        return f"{self.user.username} ({self.user.email})"


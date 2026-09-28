from django.shortcuts import render
from django.http import HttpResponse

#here we write the endpoints
def main(request):
    return HttpResponse("<h1>Hello nadin</h1>") #url point to it

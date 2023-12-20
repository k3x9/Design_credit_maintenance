from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import User,Cookie,Student,Supervisor,FacultyAdvisor,Form
from django.views.decorators.csrf import csrf_protect,ensure_csrf_cookie,csrf_exempt
from django.middleware.csrf import get_token


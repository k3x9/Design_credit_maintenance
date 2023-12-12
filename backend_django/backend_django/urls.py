"""
URL configuration for backend_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('form_submission/', views.form_submission, name='form_submission'),
    path('get_forms/', views.get_forms, name='get_forms'),
    path('approve_form/', views.approve_form, name='approve_form'),
    path('reject_form/', views.reject_form, name='reject_form'),
    path('get_forms_super/', views.get_forms_super, name='get_forms_super'),
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
    path('check_cookie/', views.check_cookie, name='check_cookie'),
    path('grade_given/', views.grade_given, name='grade_given'),
    path('get_forms_by_roll_number/', views.get_forms_by_roll_number, name='get_forms_by_roll_number'),
]

from django.db import models
from uuid import uuid4
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.postgres.fields import ArrayField

# Create your models here.
# ytb user model

# class User(models.Model):
#     name = models.CharField(max_length=30)
#     email = models.CharField(max_length=50)
#     password = models.CharField(max_length=20)
#     roll_number = models.CharField(max_length=10)
#     isFA = models.BooleanField(default=False)
#     isProf = models.BooleanField(default=False)
#     isStudent = models.BooleanField(default=False)
#     department = models.CharField(max_length=30)
#     design_credits = models.IntegerField(default=0)
#     category1 = models.IntegerField(default=0)
#     category2 = models.IntegerField(default=0)
#     category3 = models.IntegerField(default=0)
#     category4 = models.IntegerField(default=0)
#     category5 = models.IntegerField(default=0)
#     category6 = models.IntegerField(default=0)

# class Form(models.Model):
#     FormID = models.CharField(max_length=10)
#     SupervisorID = models.CharField(max_length=20)
#     roll_number = models.CharField(max_length=10)
#     course_code = models.CharField(max_length=10)
#     category = models.IntegerField(default=3)
#     title = models.CharField(max_length=100)
#     description = models.CharField(max_length=1000)
#     outside = models.BooleanField(default=False)


class User(models.Model):
    email = models.CharField(max_length=50, primary_key=True)
    password = models.CharField()
    department = models.CharField(max_length=30)
    user_type = models.CharField(max_length=20)
    groups = models.ManyToManyField(Group, related_name='custom_user_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_user_permissions')

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=30)
    roll_number = models.CharField(max_length=10)
    design_credits_completed = models.IntegerField(default=0)
    completed_course_code = ArrayField(models.CharField(max_length=10), blank=True, default=list)
    completed_in_semester = ArrayField(models.FloatField(), blank=True, default=list)
    category1 = models.IntegerField(default=0)
    category2 = models.IntegerField(default=0)
    category3 = models.IntegerField(default=0)
    category4 = models.IntegerField(default=0)
    category5 = models.IntegerField(default=0)
    category6 = models.IntegerField(default=0)
    year = models.IntegerField(default=datetime.now().year)

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=30)

class FacultyAdvisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=30)
    year = models.IntegerField(default=datetime.now().year)

class Form(models.Model):
    FormID = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    semester = models.FloatField(default=0)
    course_code = models.CharField(max_length=10)
    category = models.IntegerField(default=3)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    supervisor_outside = models.BooleanField(default=False)
    supervisor_approval = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    grade = models.CharField(max_length=2, default='NA')

class Cookie(models.Model):
    email = models.CharField(max_length=50)
    cookie = models.CharField(max_length=40)
    expiry = models.CharField(max_length=30)

    @staticmethod
    def create(email):
        cookie = Cookie(email=email, cookie=str(uuid4()), expiry=str(datetime.now() + timedelta(days=30)))
        cookie.save()
        return cookie.cookie
    
    @staticmethod
    def cookie_check(cookie):
        print(cookie)
        cookie = Cookie.objects.filter(cookie=cookie).first()
        if not cookie:
            return False
        if cookie.expiry < str(datetime.now()):
            return False
        return True
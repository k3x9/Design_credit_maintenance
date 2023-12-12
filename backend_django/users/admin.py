from django.contrib import admin
from .models import User,Cookie,Student,Supervisor,FacultyAdvisor,Form

# Register your models here.
admin.site.register(User)
admin.site.register(Cookie)
admin.site.register(Student)
admin.site.register(Supervisor) 
admin.site.register(FacultyAdvisor) 
admin.site.register(Form)   

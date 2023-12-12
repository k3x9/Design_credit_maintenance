from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import User,Cookie,Student,Supervisor,FacultyAdvisor,Form
from django.views.decorators.csrf import csrf_protect,ensure_csrf_cookie,csrf_exempt
from django.middleware.csrf import get_token
import json

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
def signup(request):
    data=json.loads(request.body.decode('utf-8'))
    print(data)
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    user_type = data.get('user_type')
    department = data.get('department')
    
    if not email or not password or not confirm_password:
        return JsonResponse({'status': 400, 'message': 'All fields are required'})

    if password != confirm_password:
        return JsonResponse({'status': 400, 'message': 'Passwords do not match'})
    
    print("HEre")
    # check email in db
    user = User.objects.filter(email=email).first()

    if user:
        return JsonResponse({'status': 400, 'message': 'Email already exists'})
    
    print("hr")
    # create user
    user = User(email=email, password=password, user_type=user_type, department=department)
    print("yes")
    user.save()

    print("hr")
    if user_type == 'student':
        check_roll = Student.objects.filter(roll_number=data.get('roll_number')).first()
        if check_roll and check_roll.user.department == department:
            user.delete()
            return JsonResponse({'status': 400, 'message': 'Invalid roll number'})
        
        student = Student(user=user, name=name, roll_number=data.get('roll_number'))
        student.save()
    elif user_type == 'supervisor':
        supervisor = Supervisor(user=user, name=name)
        supervisor.save()
    elif user_type == 'faculty_advisor':
        facultyadvisor = FacultyAdvisor(user=user, name=name)
        facultyadvisor.save()

    # success & redirect to home page
    return JsonResponse({'status': 201, 'message': 'Signup successful'})

@ensure_csrf_cookie
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email', None)
            password = data.get('password', None)
            if not email or not password:
                return JsonResponse({'status': 400, 'message': 'Email and password are required.'})

            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({'status': 400, 'message': 'Email does not exist or Incorrect password'})

            if user.password != password:
                return JsonResponse({'status': 400, 'message': 'Incorrect password'})

            cookie = Cookie.create(email)

            return JsonResponse({'status': 200, 'message': 'Login successful', 'cookie': cookie, 'user_type': user.user_type})

        except json.JSONDecodeError as e:
            return JsonResponse({'status': 400, 'message': 'Invalid JSON data.'})
    else:
        return JsonResponse({'status': 405, 'message': 'Invalid request method.'})


@csrf_exempt
def form_submission(request):
    if request.method == 'POST':
        # check cookie
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('student_cookie')
        print("cookie: ", cookie)
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        supervisorEmail = data.get('supervisorEmail').strip()
        semester = data.get('semester')
        courseCode = data.get('courseCode').strip()
        category = data.get('category')
        title = data.get('title')
        description = data.get('description')
        supervisorOutside = data.get('supervisorOutside')
        supervisorApproval = data.get('supervisorApproval')
        completed = data.get('completed')

        print("super: ", supervisorEmail)
        # extract email from cookie
        email = Cookie.objects.filter(cookie=cookie).first().email
        student = Student.objects.filter(user=User.objects.filter(email=email).first()).first()
        supervisor = Supervisor.objects.filter(user=User.objects.filter(email=supervisorEmail).first()).first()

        # check if supervisor is valid
        if not supervisor:
            return JsonResponse({'status': 400, 'message': 'Invalid supervisor'})
        
        # checking if there is form already for student that is not complete
        check_form = Form.objects.filter(student=student, completed=False).first()
        if check_form:
            return JsonResponse({'status': 400, 'message': 'Student already has a form that is not complete'})

        # checking if student has already completed design credit or not
        if student.design_credits_completed >= 6:
            return JsonResponse({'status': 400, 'message': 'Design credits completed'})
        
        # checking category criteria
        print("student: ",student.category3)
        if category == 1 and student.category1 + 2 > 4:
            return JsonResponse({'status': 400, 'message': f'4 credits compeleted in category 1'})
        if category == 2 and student.category2 + 2 > 4:
            return JsonResponse({'status': 400, 'message': f'4 credits compeleted in category 2'})
        if category == 3 and student.category3 + 2 > 4:
            return JsonResponse({'status': 400, 'message': f'4 credits compeleted in category 3'})
        if category == 4 and student.category4 + 2 > 4:
            return JsonResponse({'status': 400, 'message': f'4 credits compeleted in category 4'})
        if category == 5 and student.category5 + 2 > 2:
            return JsonResponse({'status': 400, 'message': f'2 credits compeleted in category 5'})
        if category == 6 and student.category6 + 2 > 2:
            return JsonResponse({'status': 400, 'message': f'2 credits compeleted in category 6'})
        
        # checking if student can take this semester
        if len(student.completed_in_semester) != 0:
            if float(semester) <= student.completed_in_semester[-1]:
                return JsonResponse({'status': 400, 'message': f'Cannot take this semester'})

        # checking if student has done 4 credits in a year
        last_two = student.completed_in_semester[-2:]
        if len(last_two) == 2 and last_two[1] - last_two[0] == 0.5 and float(semester) - last_two[1] == 1:
            return JsonResponse({'status': 400, 'message': f'Already taken 4 credits in a year'})
        
        # checking if student can take this course_code
        completed_course_code = student.completed_course_code
        if len(completed_course_code) == 0:
            x = int(courseCode[-4])
            if x != 1:
                return JsonResponse({'status': 400, 'message': 'Cannot take this course code'})
        else:
            x = int(completed_course_code[-1][-4])
            if int(courseCode[-4]) != x + 1:
                return JsonResponse({'status': 400, 'message': 'Cannot take this course code'})
        form = Form(student=student, supervisor=supervisor, semester=semester, course_code=courseCode, category=category, title=title, description=description, supervisor_outside=supervisorOutside, supervisor_approval=supervisorApproval, completed=completed)
        form.save()

        return JsonResponse({'status': 200, 'message': 'Form submitted successfully'})

@csrf_exempt
def get_forms(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        email = Cookie.objects.filter(cookie=cookie).first().email
        user = User.objects.filter(email=email).first()
        supervisor = Supervisor.objects.filter(user=user).first()
        
        forms = Form.objects.filter(supervisor=supervisor, supervisor_approval=False)
        forms_list = []

        for form in forms:
            student = form.student
            student_user = student.user
            form_dict = {
                'id': form.FormID,
                'studentName': student.name,
                'studentRollNumber': student.roll_number,
                'studentEmail': student_user.email,
                'semester': form.semester,
                'courseCode': form.course_code,
                'category': form.category,
                'title': form.title,
                'description': form.description,
                'supervisorOutside': form.supervisor_outside,
                'supervisorApproval': form.supervisor_approval,
                'completed': form.completed
            }
            forms_list.append(form_dict)

        return JsonResponse({'status': 200, 'message': 'Forms retrieved successfully', 'forms': forms_list})
    
@csrf_exempt
def approve_form(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        supervisor = Supervisor.objects.filter(user=User.objects.filter(email=Cookie.objects.filter(cookie=cookie).first().email).first()).first()
        formID = data.get('form_id')
        print("formID: ", formID)
        form = Form.objects.filter(FormID=formID).first()
        if not form:
            return JsonResponse({'status': 400, 'message': 'Invalid form ID'})
        
        if form.supervisor != supervisor:
            return JsonResponse({'status': 400, 'message': 'Invalid supervisor'})
        
        form.supervisor_approval = True
        form.save()

        return JsonResponse({'status': 200, 'message': 'Form approved successfully'})
    

@csrf_exempt
def get_forms_super(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        email = Cookie.objects.filter(cookie=cookie).first().email
        print("email: ", email)
        for i in range(3):
            print()
        user = User.objects.filter(email=email).first()
        fa = FacultyAdvisor.objects.filter(user=user).first()
        dept = fa.user.department

        forms = Form.objects.filter(student__user__department=dept, supervisor_approval=True, completed=False)
        forms_list = []

        for form in forms:
            student = form.student
            student_user = student.user
            form_dict = {
                'id': form.FormID,
                'studentName': student.name,
                'studentRollNumber': student.roll_number,
                'studentEmail': student_user.email,
                'semester': form.semester,
                'courseCode': form.course_code,
                'category': form.category,
                'title': form.title,
                'description': form.description,
                'supervisorOutside': form.supervisor_outside,
                'supervisorApproval': form.supervisor_approval,
                'completed': form.completed
            }
            forms_list.append(form_dict)

        return JsonResponse({'status': 200, 'message': 'Forms retrieved successfully', 'forms': forms_list})
    
@csrf_exempt
def reject_form(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        email = Cookie.objects.filter(cookie=cookie).first().email
        user = User.objects.filter(email=email).first()
        supervisor = Supervisor.objects.filter(user=user).first()
        formID = data.get('form_id')
        form = Form.objects.filter(FormID=formID).first()
        
        if not form:
            return JsonResponse({'status': 400, 'message': 'Invalid form ID'})
        
        if form.supervisor != supervisor:
            return JsonResponse({'status': 400, 'message': 'Invalid supervisor'})
        
        # delete form
        form.delete()

        return JsonResponse({'status': 200, 'message': 'Form rejected successfully'})
    
@csrf_exempt
def grade_given(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        formID = data.get('form_id')
        grade = data.get('grade')
        form = Form.objects.filter(FormID=formID).first()
        if not form:
            return JsonResponse({'status': 400, 'message': 'Invalid form ID'})
        
        form.grade = grade
        if grade == 'S':
            form.completed = True
            if form.category == 1:
                form.student.category1 += 2
            elif form.category == 2:
                form.student.category2 += 2
            elif form.category == 3:
                form.student.category3 += 2
            elif form.category == 4:
                form.student.category4 += 2
            elif form.category == 5:
                form.student.category5 += 2
            elif form.category == 6:
                form.student.category6 += 2
            form.student.design_credits_completed += 2
            form.student.completed_course_code.append(form.course_code)
            form.student.completed_in_semester.append(form.semester)
            form.student.save()
        elif grade == 'U':
            form.completed = True

        form1 = Form(student=form.student, supervisor=form.supervisor, semester=form.semester, course_code=form.course_code, category=form.category, title=form.title, description=form.description, supervisor_outside=form.supervisor_outside, supervisor_approval=form.supervisor_approval, completed=form.completed, grade=form.grade)
        form.delete()

        form1.save()

        return JsonResponse({'status': 200, 'message': 'Grade given successfully'})
    
@csrf_exempt
def check_cookie(request):
    if request.method == 'POST':
        print("aagyaaaaa")
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        return JsonResponse({'status': 200, 'message': 'Valid cookie'})
    
@csrf_exempt
def get_forms_by_roll_number(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        cookie = data.get('cookie')
        val = Cookie.cookie_check(cookie)
        if not val:
            return JsonResponse({'status': 400, 'message': 'Invalid cookie'})
        
        roll_number = data.get('roll_number')
        student = Student.objects.filter(roll_number=roll_number).first()
        if not student:
            return JsonResponse({'status': 400, 'message': 'No student with this roll number'})
        
        forms = Form.objects.filter(student=student)
        forms_list = []

        for form in forms:
            student = form.student
            student_user = student.user
            form_dict = {
                'id': form.FormID,
                'studentName': student.name,
                'studentRollNumber': student.roll_number,
                'studentEmail': student_user.email,
                'supervisorName': form.supervisor.name,
                'semester': form.semester,
                'courseCode': form.course_code,
                'category': form.category,
                'title': form.title,
                'description': form.description,
                'supervisorOutside': form.supervisor_outside,
                'supervisorApproval': form.supervisor_approval,
                'completed': form.completed,
                'grade': form.grade
            }
            forms_list.append(form_dict)

        return JsonResponse({'status': 200, 'message': 'Forms retrieved successfully', 'forms': forms_list})
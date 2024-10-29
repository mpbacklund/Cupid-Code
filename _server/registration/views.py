from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import HttpRequest
from registration.models import Dater, Cupid

contexts = {
    "/registration/sign_up/": {"message": "", "endpoint": "/registration/sign_up/"},
    "/registration/sign_up_cupid/": {"message": "Sign up as Cupid", "endpoint": "/registration/sign_up_cupid/"}
}

# Create your views here.
def sign_up(req: HttpRequest):
    if req.method == "POST":
        username = req.POST.get("username")
        email = req.POST.get("email")
        if username_already_exists(username):
            return render(request=req, template_name="registration/sign_up.html", context=contexts[req.path] | {"error": "An account with that username already exists!"})
            
        if email_already_exists(email):
            return render(request=req, template_name="registration/sign_up.html", context=contexts[req.path] | {"error": "An account with that email already exists!"})

        user = User.objects.create_user(
            username=req.POST.get("username"),
            email=req.POST.get("email"),
            password=req.POST.get("password")
        )
        if (req.path == "/registration/sign_up/"):
            # create a dater database model that has a foreign key to this user
            dater = Dater(user = user, balance = 0)
            dater.save()
        elif (req.path == "/registration/sign_up_cupid/"):
            # create a cupid database model that has a foreign key to this user
            cupid = Cupid(user = user, balance = 0, activated = True, working = True)
            cupid.save()

        login(req, user)
        return make_root_redirect_for_request(req)

    return render(request=req, template_name="registration/sign_up.html", context=contexts[req.path])

def sign_in(req):
    if req.method == "POST":
        user = authenticate(req, username=req.POST.get("username"), password=req.POST.get("password"))
        if user is not None:
            login(req, user)
            return make_root_redirect_for_request(req)
        return render(request=req, template_name="registration/sign_in.html", context={"error": "Invalid username and/or password!"})

    return render(req, "registration/sign_in.html")

def logout_view(request):
    logout(request)
    response = redirect("/registration/sign_in/")
    response.delete_cookie("accountType")
    return response

def make_root_redirect_for_request(req: HttpRequest):
    response = redirect("/")
    response.set_cookie(key="accountType", value=get_role(req.user), expires=req.session.get_expiry_date())
    return response

# returns the role (dater, cupid, manager) of the user
def get_role(user):
    userType = None

    if hasattr(user, "dater"):
        userType = "Dater"
    elif hasattr(user, "cupid"):
        userType = "Cupid"
    elif hasattr(user, "manager"):
        userType = "Manager"

    return userType

def username_already_exists(username: str):
    return User.objects.filter(username=username).exists()

def email_already_exists(email: str):
    return User.objects.filter(email=email).exists()
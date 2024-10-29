from django.contrib import admin

# Register your models here.
from .models import Manager
from .models import Dater
from .models import Cupid

admin.site.register(Manager)
admin.site.register(Cupid)
admin.site.register(Dater)
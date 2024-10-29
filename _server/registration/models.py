from django.db import models
from django.contrib.auth.models import User

class Dater(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    balance = models.DecimalField(max_digits = 7, decimal_places = 2, default = 0)
    budget = models.DecimalField(max_digits = 7, decimal_places = 2, default = 0)

class Cupid(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    balance = models.DecimalField(max_digits = 7, decimal_places = 2, default = 0)
    activated = models.BooleanField(default = False)
    working = models.BooleanField(default = False)


class Manager(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
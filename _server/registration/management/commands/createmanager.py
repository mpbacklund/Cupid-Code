from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from getpass import getpass
import os

from registration.models import Manager

class Command(BaseCommand):
    help = "Creates a new Cupid Code manager"

    def add_arguments(self, parser):
        parser.add_argument("--username")
        parser.add_argument("--email")

    def handle(self, *args, **options):
        username = options["username"] if options["username"] else input("Username: ")

        preexisting_user = User.objects.filter(username=username).first()

        if preexisting_user is not None:
            self.stderr.write(
                self.style.ERROR(f"ERROR: User with username \"{username}\" already exists!")
            )
            exit(1)


        email = options["email"] if options["email"] else input("Email: ")
        # Load the password either from an environment variable or getpass()
        # Passwords should never be passed as shell arguments
        password = os.getenv("MANAGER_PASSWORD") if "MANAGER_PASSWORD" in os.environ else getpass("Password: ")
        # TODO: For now, managers are also Django superusers, which gives access to the database.
        # We may not actually want this to be the case.
        user = User.objects.create_superuser( 
            username=username,
            email=email,
            password=password
        )
        new_manager = Manager(user=user)
        user.save()
        new_manager.save()

        self.stdout.write(
            self.style.SUCCESS('Successfully added manager "%s"' % new_manager.user.username)
        )

# Development Environment Setup

1. [Set up Docker Dev Containers for VSCode](https://code.visualstudio.com/docs/devcontainers/containers#_installation)

2. Open the local repository in VSCode

3. Run `Rebuild and Reopen in Container` in the VSCode Command Palette (press `F1` or `Ctrl+Shift+P` to open)

    VSCode will automatically sync Python dependencies using Poetry and Node dependencies using npm. It will also run Django migrations each time the Docker container is rebuilt. Keep the Django migrations up-to-date using `poetry run python manage.py makemigrations` each time you make changes to models. This will create migrations that should be committed to the git repository.

4. Press `F5` to start Node and Django after the container is ready

5. Navigate to [http://localhost:8000/]

    NOTE: If you are currently logged in to cupid code, using port `5173` instead of `8000` will also render the user pages. You will not be able to access the log in page from port `5173`, though.

# Creating a Manager

To create a manager in VSCode...

1. Press `Ctrl+Shift+P` to bring up the command palette.
2. In the popup text bar, type "Run Task" and select `Tasks: Run Task`.
3. Select `Create Cupid Code Manager`
4. Follow the prompts, supplying a username, password, and other information.
5. Done! Navigate to the login page of the web app and use the credentials you provided to log in as a manager.

To create a manager in the terminal...

1. In the root directory of the project, run `poetry run python _server/manage.py createmanager`
2. Follow the prompts, supplying a username, password, and other information.
3. Done! Navigate to the login page of the web app and use the credentials you provided to log in as a manager.

# Running Unit Tests

To run unit tests from the terminal

1. From the root directory of the project, navigate to the directory `client`
2. Run the command `npm run build`
3. Navigate back to the root directory of the project, then navigate to `_server`
4. Run the command `poetry run python manage.py test` to run the tests

## Having Issues?

If you can't connect on port `8000` or the login screen is not rendering correctly, Hannah and I(Clara) have been using this method and have found it pretty reliable.

1. Delete the sqlite database at `_server/db.sqlite3`

2. Delete all files in `_server/registration/migrations/` and `_server/core/migrations/`.

3. In your terminal, from `_server/`, run `poetry run python manage.py makemigrations core` and `poetry run python makemigrations registration`.

4. Now run `python manage.py migrate`.  

You should now be able to run the program and see the login page from port `8000`. If you still can't, check the terminal for errors. When you find solutions to new problems, add a section here explaining the fix.

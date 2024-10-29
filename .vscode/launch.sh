#!/bin/bash

npm run dev --prefix ./client/ & poetry run python ./_server/manage.py runserver 0.0.0.0:8000
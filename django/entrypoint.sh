#!/bin/sh

# Run database migrations
python3 manage.py makemigrations
python3 manage.py migrate

# Start the application
exec "$@"

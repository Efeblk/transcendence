#!/bin/bash

# Exit on any error
set -e

# Run migrations
echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# echo "Collecting static files..."
# python manage.py collectstatic --noinput

# Start the Django development server (or production server)
echo "Starting server..."
exec "$@"

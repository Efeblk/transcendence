#!/bin/bash

# Exit on any error
set -e

# Make migrations (this is optional and generally only needed in development)
echo "Making migrations..."
python manage.py makemigrations pingpong

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the Django development server (or production server)
echo "Starting server..."
exec "$@"
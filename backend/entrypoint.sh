#!/bin/bash

# Exit on any error
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the Django development server (or production server)
echo "Starting server..."
exec "$@"

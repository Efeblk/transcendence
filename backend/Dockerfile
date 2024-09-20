# Use the official Python image.
FROM python:3.12-slim

# Set environment variables to disable buffering and set the correct time zone
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev gcc build-essential  # PostgreSQL development libraries and GCC for building psycopg2

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code into the container
COPY . /app/

# Copy the entrypoint script and make it executable
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Define the entrypoint to run migrations and collect static files
ENTRYPOINT ["/app/entrypoint.sh"]
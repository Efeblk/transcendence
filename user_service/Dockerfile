FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app2

RUN apt-get update && apt-get install -y \
    libpq-dev gcc build-essential

COPY requirements.txt /app2/

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app2/

EXPOSE 8001


COPY ./entrypoint.sh /app2/entrypoint.sh
RUN chmod +x /app2/entrypoint.sh
RUN sed -i '1s|^|#!/bin/sh\n|' /app2/entrypoint.sh

# Define the entrypoint to run migrations and collect static files
ENTRYPOINT ["/app2/entrypoint.sh"]

# Default command to run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

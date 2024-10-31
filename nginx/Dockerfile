FROM nginx:alpine

# Install OpenSSL for generating SSL certificates
RUN apk add --no-cache openssl

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=localhost"

# Copy the static files from the frontend directory into Nginx's web root directory
COPY ./frontend/static /usr/share/nginx/html/

EXPOSE 80 443

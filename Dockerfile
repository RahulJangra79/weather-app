# Use nginx to serve static files
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom config
COPY default.conf /etc/nginx/conf.d/

# Copy built Vite files
COPY dist/ /usr/share/nginx/html

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]

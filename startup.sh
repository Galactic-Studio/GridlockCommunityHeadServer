#!/bin/bash

# Set the HOME environment variable
export HOME=/home/root

# Redirect output to log file
exec > startLog.out 2>&1

# Restart all PM2 processes
pm2 restart all

# Configure Nginx to proxy requests to Galactic Studio
EXPRESS_PORT=80

# Create a new user if it does not exist
if ! id "dataserver" &>/dev/null; then
  sudo useradd -m dataserver
  sudo usermod -aG wheel dataserver
fi

# Start the application using PM2
pm2 start /var/www/server/main.js

# Output status message
echo "Head Server Is Ready and running"

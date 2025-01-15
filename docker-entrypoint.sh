#!/bin/sh
# docker-entrypoint.sh

echo "Waiting for MySQL to be available..."
/usr/local/bin/wait-for-it.sh mysql:3306 --timeout=30 --strict -- echo "MySQL is up and running!"

echo "Starting the application..."
npm start
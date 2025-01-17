#!/bin/sh
# docker-entrypoint.sh

echo "Waiting for MySQL to be available..."
/usr/local/bin/wait-for-it.sh mysql:${DATABASE_PORT} --timeout=30 --strict -- echo "MySQL is up and running!"

echo "Syncing the database..."
node src/sync.js

# Check if the status of the previous command is not 0
if [ $? -ne 0 ]; then
    # If yes, then exit the script
    echo "Failed to sync the database!"
    exit 1
fi

echo "Starting the application..."
npm start
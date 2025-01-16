FROM node:23-alpine

# Install bash
RUN apk add --no-cache bash git dos2unix

# Create a directory in the container
WORKDIR /cloud

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Copy wait-for-it.sh and docker-entrypoint.sh into the container
COPY wait-for-it.sh docker-entrypoint.sh /usr/local/bin/

# Convert the files to Unix format
RUN dos2unix /usr/local/bin/wait-for-it.sh /usr/local/bin/docker-entrypoint.sh

# Make wait-for-it.sh and docker-entrypoint.sh executable in the container
RUN chmod +x /usr/local/bin/wait-for-it.sh /usr/local/bin/docker-entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Run the entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
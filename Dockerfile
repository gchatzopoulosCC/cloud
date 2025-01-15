FROM node:23-alpine

# Install bash
RUN apk add --no-cache bash git dos2unix

# Create a directory in the container
WORKDIR /cloud

# Copy package.json and package-lock.json into the container
COPY package*.json ./

COPY . .

# Copy wait-for-it.sh into the container
COPY wait-for-it.sh /usr/local/bin/

# Convert the file to Unix format
RUN dos2unix /usr/local/bin/wait-for-it.sh

# Make wait-for-it.sh executable in the container
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Copy docker-entrypoint.sh into the container
COPY docker-entrypoint.sh /usr/local/bin/

# Convert the file to Unix format
RUN dos2unix /usr/local/bin/docker-entrypoint.sh

# Make docker-entrypoint.sh executable in the container
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install dependencies
RUN npm install

# Expose port 8080
EXPOSE 4000

# Run the entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
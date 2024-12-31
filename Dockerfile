FROM node:23-alpine

# Install bash
RUN apk add --no-cache bash git
RUN git --version
# Create a directory in the container
WORKDIR /cloud

# Copy package.json and package-lock.json into the container
COPY package*.json ./
COPY . .

# Copy wait-for-it.sh into the container
COPY wait-for-it.sh /usr/local/bin/

# Make wait-for-it.sh executable in the container
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "start"]
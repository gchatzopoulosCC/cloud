# Cloud Storage Simulator
This application simulates a Cloud Storage Application. Initially, the user will choose a package (for maximum storage capacity) and then proceed to register (or log in if the user already has an account). Then the user will gain access to the application where they can upload, edit and delete files from their "remote" storage. In reality, the files will be stored locally, but they will be managed by the MinIO storage server giving the illusion that they are stored remotely.

# Setup
This section provides the instructions for setting up the project and working on your machine successfully.

## Environment Variables
- Create a `.env` file in your root directory
- Paste the following code:
```env
# Docker Backend
DATABASE_USER=<your_database_user>
DATABASE_PASSWORD=<your_database_password>
DATABASE_NAME=<your_database_name>

# Docker MySQL
MYSQL_ROOT_PASSWORD=<your_mysql_root_password>

# Docker MinIO
MINIO_ROOT_USER=<your_minio_root_user>
MINIO_ROOT_PASSWORD=<your_minio_root_password>
MINIO_BUCKET_NAME=<your_minio_bucket_name>
MINIO_REGION=<your_minio_region>

# Ports
BACKEND_PORT=<your_backend_port>
DATABASE_PORT=<your_database_port>
```
- Change `<your_database_user>` to a username of your choice.
- Change `<your_database_password>` to a database password of your choice.
- Change `<your_database_name>` to a database name of your choice.
- Change `<your_mysql_root_password>` to a root password of your choice.
- Change `<your_minio_root_user>` to a username of your choice.
- Change `<your_minio_root_password>` to a password of your choice.
- Change `<your_minio_bucket_name>` to a bucket name of your choice.
- Change `<your_minio_region>` to a region of your choice.
- Change `<your_backend_port>` to a backend port of your choice.
- Change `<your_database_port>` to a database port of your choice

Example:
```env
# Docker Backend
DATABASE_USER=root
DATABASE_PASSWORD=12345678
DATABASE_NAME=cloud

# Docker MySQL
MYSQL_ROOT_PASSWORD=12345678

# Docker MinIO
MINIO_ROOT_USER=root
MINIO_ROOT_PASSWORD=12345678
MINIO_BUCKET_NAME=cloud-storage
MINIO_REGION=eu-south-1

# Ports
BACKEND_PORT=3000
DATABASE_PORT=3306
```

## Docker
- Install docker
- Install git
- Build the docker images with:
```bash
docker-compose build
```
It will take a while until everything is built.

Start the application:
```bash
docker-compose up -d
```
It will take a while until everything is setup.

To guarantee that everything is setup before you do anything, run this command and check if you get the expected result:
```bash
docker-compose logs backend

backend-1  | Waiting for MySQL to be available...
backend-1  | wait-for-it.sh: waiting 30 seconds for mysql:3306
backend-1  | wait-for-it.sh: mysql:3306 is available after 2 seconds
backend-1  | MySQL is up and running!
backend-1  | Syncing the database...
backend-1  | Executing (default): SELECT 1+1 AS result
backend-1  | Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'cloud'
backend-1  | Connection has been established successfully.
backend-1  | Executing (default): SHOW FULL COLUMNS FROM `Users`;
backend-1  | Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'Users' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cloud' AND REFERENCED_TABLE_NAME IS NOT NULL;
backend-1  | Executing (default): ALTER TABLE `Users` CHANGE `name` `name` VARCHAR(255) NOT NULL;
backend-1  | Executing (default): ALTER TABLE `Users` CHANGE `email` `email` VARCHAR(255) NOT NULL UNIQUE;
backend-1  | Executing (default): ALTER TABLE `Users` CHANGE `password` `password` VARCHAR(255) NOT NULL;
backend-1  | Executing (default): ALTER TABLE `Users` CHANGE `createdAt` `createdAt` DATETIME NOT NULL;
backend-1  | Executing (default): ALTER TABLE `Users` CHANGE `updatedAt` `updatedAt` DATETIME NOT NULL;
backend-1  | Executing (default): SHOW INDEX FROM `Users`
backend-1  | Database synchronized successfully.
backend-1  | Starting the application...
backend-1  | 
backend-1  | > cloud@1.0.0 start
backend-1  | > node server.js
backend-1  | 
backend-1  | Server is running on http://localhost:3000
backend-1  | Executing (default): SELECT 1+1 AS result
backend-1  | Connection has been established successfully.
```

Shut down the docker containers with:
```bash
docker-compose down
```

# MinIO
Ensure that your MinIO client is working start application with:
```bash
docker-compose up -d
```

And check the MinIO logs with: 
```bash
docker-compose logs minio
```

This is the expected result:
```bash
mrchatzopoulos@fedora:~/college/web/cloud$ docker-compose logs minio
minio-1  | MinIO Object Storage Server
minio-1  | Copyright: 2015-2025 MinIO, Inc.
minio-1  | License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
minio-1  | Version: RELEASE.2024-12-18T13-15-44Z (go1.23.4 linux/amd64)
minio-1  | 
minio-1  | API: http://172.21.0.2:9000  http://127.0.0.1:9000 
minio-1  | WebUI: http://172.21.0.2:9001 http://127.0.0.1:9001  
minio-1  | 
minio-1  | Docs: https://docs.min.io
```

To access your minio console in `http://127.0.0.1:9001` you have to login with the following credentials:
- Username: The `MINIO_ROOT_USER` you have defined in your `.env`.
- Password: The `MINIO_ROOT_PASSWORD` you have defined in your `.env`.

# API Endpoints
To get access to the API documentation, set up the application and start the server with `npm start` (or `node server.js`). Then, direct to `<url>/api/docs`, where `<url>` is the initial URL (for example: `http://localhost:3000`). An example of a valid complete URL address would be `http://localhost:3000/api/docs`.

# Cloud Storage Simulator
This application simulates a Cloud Storage Application. Initially, the user will choose a package (for maximum storage capacity) and then proceed to register (or log in if the user already has an account). Then the user will gain access to the application where they can upload, edit and delete files from their "remote" storage. In reality, the files will be stored locally, but they will be managed by the MinIO storage server giving the illusion that they are stored remotely.

# Setup
This section provides the instructions required for the project to be successfully set up and working on your machine.

## Environment Variables
- Create a `.env` file in your root directory
- Paste the following code:
```env
# Docker Backend
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=<your_database_password>
DATABASE_NAME=<your_database_name>

# Docker MySQL
MYSQL_ROOT_PASSWORD=<your_mysql_host_password>
MYSQL_DATABASE=<your_database_name>

# Ports
PORT=3000
DATABASE_PORT=3306
```
- Change `<your_database_name>` to the name you gave to your database.
- Change `<your_database_password>` to your database password.
- Change `<your_mysql_host_password>` to a host password of your choise.

## Docker
- Install docker
- Install git
- Build the docker images with:
```bash
docker-compose build
```

It will take a while to install all the dependencies.

- To start the application run the following:
```bash
docker-compose up
```

You can run both the above commands simultaneously with:
```bash
docker-compose up --build
``` 
Additionally, if you prefer to run docker in the background (i.e. to hide the logs) you can use the `-d` flag when you run docker-compose. The command would like this:
```bash
docker-compose up -d
```

You can still access the logs with:
```bash
docker-compose logs
```

You can access the logs of a specific service by providing the service at the end. Example:
```bash
docker-compose logs backend
```

If there is a connection issue you can check if you have proper permissions with:
```bash
docker-compose up -d
docker exec -it mysql-db mysql -u root -p
```

Type your mysql password (the same int the .env) if requested. Then run the following SQL command:
```sql
SELECT User, Host FROM mysql.user;
```

The result should include `my_user | %` or `root | %`. If the result is different from the DATABASE_USER you have in the .env change it to the user that is returned.

Lastly, you can shut down the containers with:
```bash
docker-compose down
```

## Database Synchronisation
- If database synchronisation is needed after `docker-compose build`, then run:
```bash
node src/sync.js
```

If successful, this should be the result of the prompt:
```bash
node src/sync.js
Executing (default): DROP TABLE IF EXISTS `Users`;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'Users' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cloud' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): DROP TABLE IF EXISTS `Users`;
Executing (default): DROP TABLE IF EXISTS `Users`;
Executing (default): CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER auto_increment , `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `Users`
Database synchronized successfully.
```
#### Warning:
```
This will delete everything in the database.
```

# API Endpoints
To get access to the API documentation, set up the application and start the server with `npm start` (or `node server.js`). Then, direct to `<url>/api/docs`, where `<url>` is the initial URL (for example: `http://localhost:3000`). An example of a valid complete URL address would be `http://localhost:3000/api/docs`.

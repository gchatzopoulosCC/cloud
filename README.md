# Cloud Storage Simulator
This application simulates a Cloud Storage Application. Initially, the user will choose a package (for maximum storage capacity) and then proceed to register (or log in if the user already has an account). Then the user will gain access to the application where they can upload, edit and delete files from their "remote" storage. In reality, the files will be stored locally, but they will be managed by the MinIO storage server giving the illusion that they are stored remotely.

# Setup
This section provides a set of instruction required for the project to be successfully setup and working in your machine.
## Database
- Install MySQL ([docs(https://dev.mysql.com/doc/refman/8.0/en/installing.html)])
- Connect to your MySQL Server by running the following command:
```bash
$> mysql -h host -u user -p
Enter password: ********
```
Note:
`host` can be changed to any host of your choice and `user` can be any user of your choice.

If that works, you should see some introductory information followed by a `mysql>` prompt:
```bash
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 8.0.40-standard
Type 'help;' or '\h' for help. Type '\c' to clear the buffer.
mysql>
```

To disconnect run type `QUIT` (on Windows and MAC):
```bash
mysql> QUIT
Bye
```
or Ctrl+D (on Unix).
- Run this query to create a database:
```sql
CREATE DATABASE cloud;
```
Note:
You can change the name of the database from `cloud` to any name of your choice or keep it as it is.
- Run this queru to ensure that the database exists:
```sql
SHOW DATABASES;
```

Source: MySQL 8.0 Reference Manual. "Chapter 2 Connecting to and Disconnecting from the Server" in "MySQL Tutorial" pp. 2-9.

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
```
- Change `<your_database_name>` to the name you gave to your database.
- (DON'T FOLLOW THIS) Change `<your_database_host>` to your mysql host (the host after the `-h` flag in the `mysql -h host -u user -p` command).
- (DON'T FOLLOW THIS) Change  `<your_database_username>` to your mysql username (the username after the `-u` flag in the `mysql -h host -u user -p` command).
- Change `<your_database_password>` to your database password.
- (DON'T FOLLOW THIS) Change `<your_port_number>` to a valid port number (for example: 3000).
- Change `<your_mysql_host_password>` to a host password of your choise.

## Database Syncronisation
- Run the following command:
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

# API Endpoints
To get access to the API documentation, setup the application and start the server with `npm start` (or `node server.js`). Then, direct to `<url>/api/docs`, where `<url>` is the initial URL (for example: `http://localhost:3000`). An example of a valid complete URL address would be `http://localhost:3000/api/docs`.

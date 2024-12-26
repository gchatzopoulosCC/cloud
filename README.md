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

## ENVIRONMENT VARIABLES
- Create a `.env` file in your root directory
- Paste the following code:
```env
DB_NAME=<your_database_name>
DB_HOST=<your_database_host>
DB_USER=<your_database_username>
DB_PASSWORD=<your_database_password>
PORT=<your_port_number>
```
- Change `<your_database_name>` to the name you gave to your database.
- Change `<your_database_host>` to your mysql host (the host after the `-h` flag in the `mysql -h host -u user -p` command).
- Change  `<your_database_username>` to your mysql username (the username after the `-u` flag in the `mysql -h host -u user -p` command).
- Change `<your_database_password>` to your database password.
- Change `<your_port_number>` to a valid port number (for example: 3000).

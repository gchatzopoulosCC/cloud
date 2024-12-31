/* App configuration */

const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const sequelize = require('./db');

const app = express();

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middlewares
app.use(logger)

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
    });

app.use('/api', routes);


// Connect to the database
sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch((error) => {
    console.error('Unable to connect to the database:', error);
});

// Error handler
app.use(errorHandler);

module.exports = app;
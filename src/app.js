/* App configuration */

const express = require('express');
const cors = require('cors');
const compression = require('compression'); 
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Security and performance
app.use(cors());
app.use(compression());

// Middlewares
app.use(logger)

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
    });

app.use('/api', routes);

// Error handler
app.use(errorHandler);

module.exports = app;
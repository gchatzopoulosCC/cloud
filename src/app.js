/* App configuration */

const express = require('express');
const cors = require('cors');
const compression = require('compression'); 
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

// Auth
const { sequelize, sessionStore } = require('./db');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET_KEY || "not-secret-key", 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 3600000, // 1 hour
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    },
  }));

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Security and performance
app.use(cors());
app.use(compression());

// Middlewares
app.use(logger);

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
    });

app.use('/api', routes);
app.use('/auth', authRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
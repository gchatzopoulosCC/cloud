/* Database configuration */

const { Sequelize } = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: 'mysql',
        dialect: 'mysql',
        port: process.env.DATABASE_PORT || 3306,
        logging: console.log,
    }
);

// Connect to the database
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

// Sessions
const sessionStore = new SequelizeStore({
    db: sequelize,
    expiration: 24 * 60 * 60 * 1000, // 1 day
});

module.exports = {sequelize, sessionStore};
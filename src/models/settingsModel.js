const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const User = require("./userModel");

// Define the only valid values for the plan
const validPlans = ['free', 'premium'];

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [validPlans],
        },
    },
    notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

});

Settings.hasMany(User, {
    foreignKey: 'settingsId',
    onDelete: 'CASCADE',
});

User.belongsTo(Settings, {
    foreignKey: 'settingsId',
});

module.exports = {
    Settings,
    validPlans
};
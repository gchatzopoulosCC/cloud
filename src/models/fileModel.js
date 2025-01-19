const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const File = sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            }
        }
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Size is required'
            },
            isPositive(value) {
                if (value < 0) {
                    throw new Error('Size must be a positive number');
                }
            }   
        }
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Type is required'
            },
            isIn: {
                args: [['image/jpeg', 'image/png', 'application/pdf']], 
                msg: 'Invalid file type'
            }
        }
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Path is required'
            }
        }
    }
});

module.exports = File;
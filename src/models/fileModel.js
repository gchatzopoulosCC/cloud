const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");
const User = require("./userModel");

const File = sequelize.define("File", {
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
        msg: "Name is required",
      },
    },
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Size is required",
      },
      isPositive(value) {
        if (value < 0) {
          throw new Error("Size must be a positive number");
        }
      },
    },
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Type is required",
      },
      isIn: {
        args: [[".jpg", ".png", ".pdf", ".docx", ".txt", ".xlsx"]],
        msg: "Invalid file type",
      },
    },
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Path is required",
      },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "User ID is required",
      },
      isInt: {
        msg: "User ID must be an integer",
      },
    },
  },
});

User.hasMany(File, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

File.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = File;

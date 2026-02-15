const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // your Sequelize config

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 15], // simple validation for phone length
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user", // default role is 'user'
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;

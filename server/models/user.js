const Sequelize = require("sequelize");
const sequelize = require("../db.js");

const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: "users_username_unique",
      allowNull: false,
      validate: {
        len: {
          args: [3, 20],
          msg: "Username must be between 3 and 20 characters long.",
        },
        isAlphanumeric: {
          msg: "Username can only contain letters and numbers.",
        },
        isNotOnlyNumbers(value) {
          if (/^\d+$/.test(value)) {
            throw new Error("Username cannot be only numbers.");
          }
        },
        isUnique(value, next) {
          User.findOne({ where: { username: value } })
            .then((user) => {
              if (user) {
                return next("Username already in use.");
              }
              return next();
            })
            .catch((err) => next(err));
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be between 8 and 100 characters long.",
        },
        isStrong(value) {
          if (
            !/[A-Z]/.test(value) || // Missing uppercase
            !/[a-z]/.test(value) || // Missing lowercase
            !/[0-9]/.test(value) || // Missing number
            !/[^A-Za-z0-9]/.test(value) // Missing special character
          ) {
            throw new Error(
              "Password must include uppercase, lowercase, number, and special character."
            );
          }
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Must be a valid email address.",
        },
        isUnique(value, next) {
          User.findOne({ where: { email: value } })
            .then((user) => {
              if (user) {
                return next("Email already in use.");
              }
              return next();
            })
            .catch((err) => next(err));
        },
      },
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);
module.exports = User;

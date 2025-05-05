const Sequelize = require("sequelize");
const sequelize = require("../db.js");
const Post = sequelize.define(
  "posts",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    img: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tags: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { timestamps: true }
);
module.exports = Post;

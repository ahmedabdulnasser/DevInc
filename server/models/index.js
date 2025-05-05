const User = require("./user.js");
const Post = require("./post.js");
const Comment = require("./comment.js");
const sequelize = require("../db");
const Sequelize = require("sequelize");

// User and Post associations
User.hasMany(Post, { foreignKey: "user_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Post and Comment associations
Post.hasMany(Comment, { foreignKey: "post_id", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "post_id", as: "post" });

// User and Comment associations
User.hasMany(Comment, { foreignKey: "user_id", as: "userComments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "author" });

module.exports = { User, Post, Comment, sequelize };

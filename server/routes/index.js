const express = require("express");
const userRoutes = require("./user.routes");
const postRoutes = require("./post.routes");
const commentRoutes = require("./comment.routes");
const { authenticateToken } = require("../utils/auth");

const router = express.Router();

// Group routes under /api prefix
router.use(authenticateToken);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;

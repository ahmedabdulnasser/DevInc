const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getAllUsers);
router.get("/search", userController.searchUsers);
router.get("/me", userController.getCurrentUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id/posts", userController.getUserPosts);
router.get("/:id/comments", userController.getUserComments);

module.exports = router;

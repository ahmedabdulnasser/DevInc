const { User, Post, Comment } = require("../models");

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: Post, as: "post", attributes: ["id", "title"] },
        { model: User, as: "author", attributes: ["id", "username"] },
      ],
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: Post, as: "post", attributes: ["id", "title"] },
        { model: User, as: "author", attributes: ["id", "username"] },
      ],
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { body, post_id, user_id } = req.body;
    if (!body || !post_id || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingPost = await Post.findByPk(post_id);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newComment = await Comment.create({ body, post_id, user_id });
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { body } = req.body;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await comment.update({ body });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { Op } = require("sequelize");
const { User, Post, Comment } = require("../models");

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      posts: rows,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query)
      return res.status(400).json({ error: "Query parameter is required" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { body: { [Op.like]: `%${query}%` } },
        ],
      },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    if (count === 0) return res.status(404).json({ error: "No posts found" });

    res.json({
      posts: rows,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });

    // res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["username", "id", "avatar"] },
      ],
    });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, body, img, tags, user_id } = req.body;
    if (!title || !body || !user_id) {
      return res
        .status(400)
        .json({ error: "Title and body fields are required" });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = await Post.create({ title, body, img, tags, user_id });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, body, img, tags } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.update({ title, body, img, tags });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["username", "id", "avatar"],
            },
          ],
        },
      ],
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.comments.length === 0)
      return res.status(404).json({ error: "No comments found" });

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

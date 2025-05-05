const { Op } = require("sequelize");
const { User, Post, Comment } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "username",
        "email",
        "avatar",
        "firstName",
        "lastName",
        "createdAt",
      ],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const newUser = await User.create({
      username,
      password,
      email,
      firstName,
      lastName,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, email, avatar } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ username, password, email, avatar });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Post,
        as: "posts",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.posts || user.posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    res.json(user.posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Post,
        as: "posts",
        include: {
          model: Comment,
          as: "comments",
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comments = user.posts.flatMap((post) => post.comments || []);
    if (comments.length === 0) {
      return res.status(404).json({ error: "No comments found for this user" });
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "username",
        "email",
        "avatar",
        "firstName",
        "lastName",
        "createdAt",
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

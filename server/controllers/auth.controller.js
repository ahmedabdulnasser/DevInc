const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/auth");

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ error: "All fields required" });

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser)
    return res.status(400).json({ error: "User already exists" });

  const userToValidate = User.build({ username, email, password });
  try {
    await userToValidate.validate();
  } catch (validationError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationError.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  const token = generateToken(user);

  res.status(201).json({ message: "User registered", token });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user)
    return res.status(401).json({ error: "Wrong username or password." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ error: "Wrong username or password." });

  const token = generateToken(user);
  res.json({ token });
};

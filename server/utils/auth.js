const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "your_secret_key";

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1d",
  });
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

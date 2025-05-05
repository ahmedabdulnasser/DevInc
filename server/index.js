const express = require("express");
const sequelize = require("./db");
const { User, Post, Comment } = require("./models");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const apiRoutes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173/",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/users", userRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database tables created/updated successfully.");
    app.listen(PORT, () => {
      console.log("Server is now up at http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.error("Error creating/updating database tables: ", err);
  });

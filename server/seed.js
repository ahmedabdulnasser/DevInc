// seed.js
const { sequelize, User, Post, Comment } = require("./models/index");
const {
  userFactory,
  postFactory,
  commentFactory,
} = require("./factories/factories");

async function seed() {
  try {
    // Re-create tables (warning: this drops existing data)
    await sequelize.sync({ force: true });

    // 1. Create users
    const userCount = 10;
    const usersData = Array.from({ length: userCount }, () => userFactory());
    const users = await User.bulkCreate(usersData, { returning: true });

    // 2. Create posts for each user
    const postsPerUser = 5;
    const posts = [];
    for (const user of users) {
      for (let i = 0; i < postsPerUser; i++) {
        posts.push(postFactory(user.id));
      }
    }
    const createdPosts = await Post.bulkCreate(posts, { returning: true });

    // 3. Create comments randomly
    const comments = [];
    const commentCount = 50;
    for (let i = 0; i < commentCount; i++) {
      // pick random user & random post
      const user = users[Math.floor(Math.random() * users.length)];
      const post =
        createdPosts[Math.floor(Math.random() * createdPosts.length)];
      comments.push(commentFactory(user.id, post.id));
    }
    await Comment.bulkCreate(comments);

    console.log("✅ Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();

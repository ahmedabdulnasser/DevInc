const faker = require("faker");
const { User, Post, Comment } = require("../models");

function userFactory() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(12, false, /[A-Za-z0-9!@#$%^&*()]/),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function postFactory(userId) {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    img: faker.image.imageUrl(),
    tags: faker.lorem.words(3).split(" ").join(","),
    user_id: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function commentFactory(userId, postId) {
  return {
    body: faker.lorem.sentences(1),
    user_id: userId,
    post_id: postId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { userFactory, postFactory, commentFactory };

const testRouter = require("express").Router();
const { User, Blog } = require("./mongo");

testRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  response.status(204).end();
});

module.exports = testRouter;

const handleLocalStorage = (token) => {
  let date = new Date();
  let inFiveMinutes = date.setTime(date.getTime() + 5 * 60 * 1000);
  document.cookie = `username=${token.username}; expires=${inFiveMinutes}`;
  document.cookie = `token=${token.token}; expires=${inFiveMinutes}`;
  document.cookie = `name=${token.name}; expires=${inFiveMinutes}`;
};

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    handleLocalStorage(body);
    // cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("addBlog", ({ title, author, url, likes }) => {
  cy.get("#toggleForm").click();
  cy.contains("title");
  cy.get("#title-input").type(title);
  cy.get("#author-input").type(author);
  cy.get("#url-input").type(url);
  cy.get("#likes-input").type(likes);
  cy.contains("Add Blog").click();
});

describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("blog");
    cy.contains("username");
  });

  it("user can login", function () {
    cy.login({ username: "mluukkai", password: "salainen" });
    cy.get("#username").type("mluukkai");
    cy.get("#password").type("salainen");
    cy.get("#login").click();
    cy.contains("Matti Luukkainen is logged in");
  });
});

describe("when logged in", function () {
  //   beforeEach(function () {
  //     cy.get("#username").type("oryan");
  //     cy.get("#password").type("oryan");
  //     cy.get("#login").click();
  //     cy.contains("oryan is logged in");
  //   });

  it("add a new Blog", function () {
    cy.get("#toggleForm").click();
    cy.contains("title");
    cy.get("#title-input").type("blog 1");
    cy.get("#author-input").type("blog 1");
    cy.get("#url-input").type("blog 1");
    cy.get("#likes-input").type(1);
    cy.contains("Add Blog").click();
  });

  it("add a second Blog", function () {
    cy.addBlog({ title: "blog 2", author: "blog 2", url: "blog 2", likes: 30 });
  });

  it("User log Out", function () {
    cy.get("#logout-button").click();
  });

  it("user can login again", function () {
    cy.get("#username").type("mluukkai");
    cy.get("#password").type("salainen");
    cy.get("#login").click();
    cy.contains("Matti Luukkainen is logged in");
  });

  it("Test Show Blogs", function () {
    cy.contains("Show Blogs").click();
  });

  it("Like a Post", function () {
    cy.get("#like").click();
    cy.contains("Unlike");
  });

  it("Like a second Post", function () {
    cy.contains("span", "blog 2")
      .parent("p")
      .parent("div")
      .find("#like")
      .as("likeButton");
    cy.get("@likeButton").click();
    cy.get("@likeButton").should("contain", "Unlike");
  });

  it("use can remove a Post", function () {
    cy.contains("span", "blog 2")
      .parent("p")
      .parent("div")
      .contains("button", "remove")
      .as("removeButton");
    cy.get("@removeButton").click();
  });
});

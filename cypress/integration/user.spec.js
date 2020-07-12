describe("User", () => {
  let token = null,
    adminToken = null;
  let adminLogin = {
    email: "raphealolams@yahoo.com",
    password: "wemove",
  };
  let userLogin = {
    email: "raphealolams@gmail.com",
    password: "wemove",
  };

  before(() => {
    cy.exec("npm run drop && npm run import:data");
  });

  describe("Register a New User", () => {
    it("should report error when request body is empty", () => {
      cy.request({
        url: "/v1/users/register",
        method: "POST",
        body: {
          firstName: "",
          lastName: "Ajilore",
          email: "raphealolams@yahoo.com",
          password: "wemove",
          confirmPassword: "wemove",
          role: "user",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "missing or empty request body"
        );
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("errors");
      });
    });

    it("should report error when email is not valid", () => {
      cy.request({
        url: "/v1/users/register",
        method: "POST",
        body: {
          firstName: "Raphael",
          lastName: "Ajilore",
          email: "raphealolams@yahoo",
          password: "wemove",
          confirmPassword: "wemove",
          role: "user",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "email string not valid");
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("errors");
      });
    });

    it("should report error when password is mismatch", () => {
      cy.request({
        url: "/v1/users/register",
        method: "POST",
        body: {
          firstName: "Raphael",
          lastName: "Ajilore",
          email: "raphealolams@yahoo.com",
          password: "wemove1",
          confirmPassword: "wemove",
          role: "user",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 422);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "Password Mis-match");
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("errors");
      });
    });
    it("should register a new user", () => {
      cy.request({
        url: "/v1/users/register",
        method: "POST",
        body: {
          firstName: "Raphael",
          lastName: "Ajilore",
          email: "fakemail@gmail.com",
          password: "wemove",
          confirmPassword: "wemove",
          role: "user",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 201);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property(
          "message",
          "user successfully created"
        );
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("bearerToken");
        expect(response.body.data).to.property("expiresIn", "24h");
      });
    });
  });

  describe("Login", () => {
    it("should report error when email and password are not provided or empty", () => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: { email: "", password: " " },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "email string not valid");
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("errors");
      });
    });

    it("should report error when email or password are not valid", () => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: { email: "raphealolams@we.com", password: "wemovew" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 422);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "invalid email or password"
        );
        expect(response.body).to.property("data");
        expect(response.body.data).to.property("errors");
      });
    });

    it("hands successful login request", () => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: userLogin,
      }).then((response) => {
        token = response.body.data.bearerToken;
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "login successful");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Get All Users", () => {
    beforeEach(() => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: adminLogin,
      }).then((response) => {
        adminToken = response.body.data.bearerToken;
      });
    });
    it("should report error when auth header is empty", () => {
      cy.request({
        url: "/v1/users",
        method: "GET",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 401);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "Authorization code is empty."
        );
        expect(response.body).to.property("data");
      });
    });

    it("should report error when user does not have access to this route", () => {
      cy.request({
        url: "/v1/users",
        method: "GET",
        auth: {
          bearer: token.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 401);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "Access Unauthorized");
        expect(response.body).to.property("data");
      });
    });

    it("should fetch all users", () => {
      cy.request({
        url: "/v1/users",
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "users fetched");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Me", () => {
    it("should report error when auth header is empty", () => {
      cy.request({
        url: "/v1/users/me",
        method: "GET",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 401);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "Authorization code is empty."
        );
        expect(response.body).to.property("data");
      });
    });

    it("should fetch current user details", () => {
      cy.request({
        url: "/v1/users/me",
        method: "GET",
        auth: {
          bearer: token.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "user fetched");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Delete", () => {
    it("should report error when auth header is empty", () => {
      cy.request({
        url: "/v1/users/me",
        method: "GET",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 401);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "Authorization code is empty."
        );
        expect(response.body).to.property("data");
      });
    });

    it("should report error when user does not have access to this route", () => {
      cy.request({
        url: "/v1/users/delete",
        method: "DELETE",
        auth: {
          bearer: token.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 401);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "Access Unauthorized");
        expect(response.body).to.property("data");
      });
    });

    it("should report when user email is invalid", () => {
      cy.request({
        url: "/v1/users/delete",
        method: "DELETE",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        body: {
          email: "",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property("message", "email string not valid");
        expect(response.body).to.property("data");
      });
    });

    it("should delete user", () => {
      cy.request({
        url: "/v1/users/delete",
        method: "DELETE",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        body: {
          email: userLogin.email,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property(
          "message",
          "user successfully deleted"
        );
        expect(response.body).to.property("data");
      });
    });
  });
});

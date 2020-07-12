describe("Comment", () => {
  let token = null,
    adminToken = null,
    ticketId = null,
    adminTicketId = null;
  let userLogin = {
    email: "raphealolams@gmail.com",
    password: "wemove",
  };

  let adminLogin = {
    email: "raphealolams@yahoo.com",
    password: "wemove",
  };

  before(() => cy.exec("npm run drop && npm run import:data"));
  beforeEach(() => {
    cy.request({
      url: "/v1/users/login",
      method: "POST",
      body: userLogin,
    }).then((response) => {
      token = response.body.data.bearerToken;
    });
    cy.request({
      url: "/v1/users/login",
      method: "POST",
      body: adminLogin,
    }).then((response) => {
      adminToken = response.body.data.bearerToken;
    });
  });
  describe("Create Comment", () => {
    beforeEach(() => {
      cy.request({
        url: "/v1/tickets/getTickets?status=all",
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
      }).then((response) => {
        ticketId =
          response.body.data[
            Math.floor(Math.random() * response.body.data.length)
          ]._id;
      });
    });
    it("should report error when user submitting a comment is not authenticated", () => {
      cy.request({
        url: "/v1/comments/create",
        method: "POST",
        body: {
          ticketId,
          comment: "shit happens",
        },
        failOnStatusCode: false,
        auth: {
          bearer: "",
        },
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
    it("should report error when request body is empty", () => {
      cy.request({
        url: "/v1/comments/create",
        method: "POST",
        body: {
          ticketId: " ",
          comment: " ",
        },
        failOnStatusCode: false,
        auth: {
          bearer: token.split(" ")[1],
        },
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
      });
    });

    it("should report error when user is trying to comment while an admin as not commented", () => {
      cy.request({
        url: "/v1/comments/create",
        method: "POST",
        body: {
          ticketId,
          comment: "shit happens",
        },
        failOnStatusCode: false,
        auth: {
          bearer: token.split(" ")[1],
        },
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 422);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "You can't comment unless a support agent does"
        );
        expect(response.body).to.property("data");
      });
    });

    it("should create a comment for an admin", () => {
      cy.request({
        url: "/v1/comments/create",
        method: "POST",
        body: {
          ticketId,
          comment: "Human with all the abilities",
        },
        auth: {
          bearer: adminToken.split(" ")[1],
        },
      }).then((response) => {
        adminTicketId = ticketId;
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "comment saved");
        expect(response.body).to.property("data");
      });
    });

    it("should create a comment for an user", () => {
      cy.request({
        url: "/v1/comments/create",
        method: "POST",
        body: {
          ticketId: adminTicketId,
          comment: "Human with all the abilities",
        },
        auth: {
          bearer: token.split(" ")[1],
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "comment saved");
        expect(response.body).to.property("data");
      });
    });
  });
});

describe("Ticket", () => {
  let token = null,
    adminToken = null,
    ticketId,
    userId;
  let userLogin = {
    email: "raphealolams@gmail.com",
    password: "wemove",
  };

  let adminLogin = {
    email: "raphealolams@yahoo.com",
    password: "wemove",
  };

  before(() => cy.exec("npm run drop && npm run import:data"));

  describe("Create Ticket", () => {
    beforeEach(() => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: userLogin,
      }).then((response) => {
        token = response.body.data.bearerToken;
      });
    });
    it("should report error when user submitting a ticket is not authenticated", () => {
      cy.request({
        url: "/v1/tickets/create",
        method: "POST",
        body: {
          title: "I can't access my deezer app",
          description: "Human with all the abilities",
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
        url: "/v1/tickets/create",
        method: "POST",
        body: {
          title: " ",
          description: " ",
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
    it("should create a new ticket", () => {
      cy.request({
        url: "/v1/tickets/create",
        method: "POST",
        body: {
          title: "I can't access my deezer app",
          description: "Human with all the abilities",
        },
        auth: {
          bearer: token.split(" ")[1],
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 201);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property(
          "message",
          "ticket successfully created"
        );
        expect(response.body).to.property("data");
      });
    });
  });

  describe("User Get Ticket", () => {
    beforeEach(() => {
      cy.request({
        url: "/v1/users/login",
        method: "POST",
        body: userLogin,
      }).then((response) => {
        token = response.body.data.bearerToken;
      });
    });
    it("should report error if user is not authenticated", () => {
      cy.request({
        url: "/v1/tickets/me",
        method: "GET",
        auth: {
          bearer: " ",
        },
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

    it("should get authenticated user ticket", () => {
      cy.request({
        url: "/v1/tickets/me",
        method: "GET",
        auth: {
          bearer: token.split(" ")[1],
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "tickets fetch");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Get Tickets", () => {
    before(() => {
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
        url: "/v1/tickets/getTickets",
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
        url: "/v1/tickets/getTickets",
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

    it("should report error if query string is not passed", () => {
      cy.request({
        url: "/v1/tickets/getTickets",
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "missing or empty query string"
        );
        expect(response.body).to.property("data");
      });
    });

    it("should get tickets", () => {
      cy.request({
        url: "/v1/tickets/getTickets?status=all",
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
        expect(response.body).to.property("message", "tickets fetched");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Get Ticket", () => {
    before(() => {
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
    it("should report error when auth header is empty", () => {
      cy.request({
        url: `/v1/tickets/getTicket?ticketId=${ticketId}`,
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
        url: `/v1/tickets/getTicket?ticketId=${ticketId}`,
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

    it("should report error if query string is not passed (ticketId)", () => {
      cy.request({
        url: "/v1/tickets/getTicket",
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "missing or empty query string"
        );
        expect(response.body).to.property("data");
      });
    });

    it("should get ticket", () => {
      cy.request({
        url: `/v1/tickets/getTicket?ticketId=${ticketId}`,
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
        expect(response.body).to.property("message", "ticket fetch");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Close Ticket", () => {
    before(() => {
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
    it("should report error when auth header is empty", () => {
      cy.request({
        url: `/v1/tickets/closeATicket`,
        method: "PUT",
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
        url: `/v1/tickets/closeATicket`,
        method: "PUT",
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

    it("should report error if request body is empty", () => {
      cy.request({
        url: "/v1/tickets/closeATicket",
        method: "PUT",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        body: {
          ticketId: "",
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
      });
    });

    it("should close a ticket", () => {
      cy.request({
        url: `/v1/tickets/closeATicket`,
        method: "PUT",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        body: {
          ticketId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 200);
        expect(response.body).to.property("error", false);
        expect(response.body).to.property("message", "ticket closed");
        expect(response.body).to.property("data");
      });
    });
  });

  describe("Ticket Report", () => {
    it("should report error when auth header is empty", () => {
      cy.request({
        url: `/v1/tickets/report`,
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
        url: `/v1/tickets/report`,
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

    it("should generate ticket report", () => {
      cy.request({
        url: `/v1/tickets/report`,
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  describe("Get Ticket By User Id", () => {
    beforeEach(() => {
      cy.request({
        url: "/v1/users",
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
      }).then((response) => {
        userId = response.body.data.find((item) => item.role === "user")._id;
      });
    });
    it("should report error when auth header is empty", () => {
      cy.request({
        url: `/v1/tickets/user`,
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
        url: `/v1/tickets/user`,
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

    it("should report error when user id is empty or null", () => {
      cy.request({
        url: `/v1/tickets/user`,
        method: "GET",
        auth: {
          bearer: adminToken.split(" ")[1],
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.property("code", 400);
        expect(response.body).to.property("error", true);
        expect(response.body).to.property(
          "message",
          "missing or empty query string"
        );
        expect(response.body).to.property("data");
      });
    });

    it("should get tickets belonging to a user", () => {
      cy.request({
        url: `/v1/tickets/user?userId=${userId}`,
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
        expect(response.body).to.property("message", "tickets fetch");
        expect(response.body).to.property("data");
      });
    });
  });
});

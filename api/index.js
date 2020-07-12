module.exports = (app, options, controllers) => {
  const {
    cors,
    loggerMiddleware,
    requestTimeLogger,
    jwtHelper: { verifyToken },
    swagger,
    swaggerDocument,
  } = options;

  app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );

  app.use("/", swagger.serve);
  app.get(
    "/docs",
    swagger.setup(swaggerDocument, {
      explorer: true,
    })
  );

  app.use(loggerMiddleware);
  app.use(requestTimeLogger);

  const { userController, ticketController, commentController } = controllers;
  const user = userController(options);
  const ticket = ticketController(options);
  const comment = commentController(options);

  app.post("/v1/users/register", user.register);
  app.post("/v1/users/login", user.login);
  app.get("/v1/users/me", verifyToken, user.me);
  app.get("/v1/users", verifyToken, user.allUsers);

  app.delete("/v1/users/delete", verifyToken, user.deleteUser);

  app.post("/v1/tickets/create", verifyToken, ticket.createTicket);
  app.get("/v1/tickets/getTickets", verifyToken, ticket.getTickets);
  app.get("/v1/tickets/getTicket", verifyToken, ticket.getTicket);
  app.get("/v1/tickets/me", verifyToken, ticket.getTicketsMe);
  app.get("/v1/tickets/user", verifyToken, ticket.getTicketsByUser);
  app.get("/v1/tickets/report", verifyToken, ticket.generateTicketReport);
  app.put("/v1/tickets/closeATicket", verifyToken, ticket.closeATicket);

  app.post("/v1/comments/create", verifyToken, comment.createComment);
};

const data = require("../utils/data");

const ticketController = (options) => {
  const {
    responseHandler,
    httpStatus,
    repo,
    validators,
    to,
    makePdf,
    models: { tickets },
  } = options;

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that handles ticket creation
   * @author it returns ticketId
   * @author protected route
   */
  const createTicket = async (req, res, next) => {
    try {
      const { body, authUser } = req;

      const errors = validators.checkRequestBody(body, [
        "title",
        "description",
      ]);
      if (errors) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty request body",
            response: {
              errors,
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      body.tag = `tag-${Math.ceil(
        Math.random() * (Number("999999") - Number("111111")) + Number("111111")
      )}`;
      body.userId = authUser._id;

      const { error, data } = await repo.create(tickets, body);

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "unable to create ticket",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return responseHandler.success(
        res,
        {
          message: "ticket successfully created",
          response: {
            ...data._doc,
          },
        },
        httpStatus.CREATED
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that gets all tickets
   * @author it accepts a query string
   * @author query = { status : 'open' || 'closed' || 'all' }
   * @author protected route
   */
  const getTickets = async (req, res, next) => {
    try {
      const { query } = req;
      const isQuery = validators.isValidQuery(query);

      if (!isQuery || !["open", "closed", "all"].includes(query.status)) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty query string",
            response: {},
          },
          httpStatus.BAD_REQUEST
        );
      }

      const { error, data } = await repo.findAll(
        tickets,
        { status: query.status === "all" ? undefined : query.status },
        [],
        [
          { path: "userId", select: "firstName lastName _id" },
          {
            path: "comments.userId",
            select: "firstName lastName -_id",
          },
        ]
      );

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "unable to fetch ticket",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return responseHandler.success(
        res,
        {
          message: "tickets fetched",
          response: data,
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that get a ticket
   * @author accepts a query string if admin or support agent try's to use it to get user's ticket
   * @author query = { ticketId : 'ticketId of ticket support agent or admin is trying to get'}
   * @author protected route
   */
  const getTicket = async (req, res, next) => {
    try {
      const { query } = req;
      const isQueryValid = validators.isEmptyValues(query);

      if (isQueryValid) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty query string",
            response: {
              errors: {
                ticketId: "is required",
              },
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      const { error, data } = await repo.findOne(
        tickets,
        { _id: query.ticketId },
        [],
        [
          { path: "userId", select: "firstName lastName _id" },
          {
            path: "comments.userId",
            select: "firstName lastName -_id",
          },
        ]
      );

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "unable to fetch tickets",
            response: {
              error: errors,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return responseHandler.success(
        res,
        {
          message: "ticket fetch",
          response: {
            ...data._doc,
          },
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  const getTicketsByUser = async (req, res, next) => {
    try {
      const { query } = req;
      const isQueryValid = validators.isEmptyValues(query);

      if (isQueryValid) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty query string",
            response: {
              errors: {
                userId: "is required",
              },
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      const { error, data } = await repo.findAll(
        tickets,
        { query },
        [],
        [
          { path: "userId", select: "firstName lastName _id" },
          {
            path: "comments.userId",
            select: "firstName lastName -_id",
          },
        ]
      );

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty query string",
            response: {
              errors: error,
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      return responseHandler.success(
        res,
        {
          message: "tickets fetch",
          response: data,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that get tickets that belongs to a user
   * @author accepts a query string if admin or support agent try's to use it to get user's ticket
   * @author accepts user token from the auth header to fetch tickets if the user is logged-in
   * @author protected route
   */
  const getTicketsMe = async (req, res, next) => {
    try {
      const {
        authUser,
        query: { page, limit },
      } = req;
      const filterCondition = {};
      filterCondition.page = parseInt(page || 1);
      filterCondition.limit = parseInt(limit || 20);
      filterCondition.offset = parseInt(
        filterCondition.limit * filterCondition.page - filterCondition.limit
      );
      filterCondition.order = { createdAt: -1 };
      filterCondition.find = {
        userId: authUser._id,
      };

      const { errors, data } = await repo.findAll(
        tickets,
        Object.assign(filterCondition),
        [],
        [
          "",
          {
            path: "comments.userId",
            select: "firstName lastName -_id",
          },
        ]
      );

      if (errors) {
        return responseHandler.failure(
          res,
          {
            message: "unable to fetch tickets",
            response: {
              errors,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return responseHandler.success(
        res,
        {
          message: "tickets fetch",
          response: data,
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that close a ticket
   * @author it accepts a request body
   * @author body = { ticketId : 'id of ticket when opened'}
   * @author protected route
   */
  const closeATicket = async (req, res, next) => {
    try {
      const { body } = req;
      const errors = validators.checkRequestBody(body, ["ticketId"]);

      if (errors) {
        return responseHandler.failure(
          res,
          {
            message: "missing or empty request body",
            response: {
              errors,
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      const { error, data } = await repo.update(
        tickets,
        { _id: body.ticketId },
        { status: "closed" }
      );

      if (errors) {
        return responseHandler.failure(
          res,
          {
            message: "unable to close ticket",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return responseHandler.success(
        res,
        {
          message: "ticket closed",
          response: {
            ...data._doc,
          },
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that generate closed tickets report for a month
   * @author sends back a pdf file to the client
   * @author protected route
   */
  const generateTicketReport = async (req, res, next) => {
    try {
      const { error, reports } = await repo.generateTicketReport(tickets);

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "error generating report",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const data = [
        ["Title", "Description", "Ticket Tag", "Date Opened", "Date Closed"],
      ];

      reports.forEach((report) => {
        const row = [];

        row.push(report.title);
        row.push(report.description);
        row.push(report.tag);
        row.push(
          new Date(report.createdAt)
            .toISOString()
            .split("T")
            .join(" ")
            .slice(0, 19)
        );
        row.push(
          new Date(report.updatedAt)
            .toISOString()
            .split("T")
            .join(" ")
            .slice(0, 19)
        );
        data.push(row);
      });

      const documentContent = [
        { text: "Report", style: "header" },
        {
          text: "Report of Closed tickets",
          style: "subheader",
        },
        {
          style: "tableExample",
          table: {
            body: data,
          },
        },
      ];

      const [errors, pdfFile] = await to(
        makePdf.generatePdfWithTables(documentContent)
      );

      if (errors) {
        return responseHandler.failure(
          res,
          {
            message: "pdf generating failed",
            response: {
              errors,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }
      return responseHandler.success(res, pdfFile, httpStatus.OK, true);
    } catch (error) {
      return next(error);
    }
  };

  return Object.create({
    createTicket,
    getTickets,
    getTicket,
    closeATicket,
    getTicketsMe,
    getTicketsByUser,
    generateTicketReport,
  });
};

module.exports = ticketController;

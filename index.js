/* eslint-disable no-unused-vars */
/*
 * Author: Raphael Ajilore.
 */

/**
 * @author we load all the dependencies we need
 */

require("dotenv").config();
const { EventEmitter } = require("events");

const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const winston = require("winston");
const jwt = require("jsonwebtoken");
const utf8 = require("utf8");
const base64 = require("base-64");
const cors = require("cors");
const bcrypt = require("bcrypt");
const to = require("await-to-js").default;
const PdfMakePrinter = require("pdfmake/src/printer");
const swagger = require("swagger-ui-express");
const mongoose = require("mongoose");

const responseHandler = require("./utils/response_manager");
const httpStatus = require("./constants/http_status");

const server = require("./server/server");
const repository = require("./repository/repository");
const {
  dbSettings,
  serverSettings,
  jwt: { secret, expiresIn },
} = require("./config");
const API = require("./api");
const winstonLogger = require("./utils/logger");
const jwtHelper = require("./utils/jwt_helper");
const validators = require("./utils/validators");
const makePdf = require("./utils/pdf_helper");
const { adminRoutes } = require("./utils/data");

const { logger, requestTimeLogger, loggerMiddleware } = winstonLogger.logger(
  serverSettings.env,
  winston
);
const userController = require("./controllers/user.controller");
const ticketController = require("./controllers/ticket.controller");
const commentController = require("./controllers/comment.controller");

const swaggerDocument = require("./doc/swagger.json");

const database = require("./models");
const userModel = require("./models/users");
const ticketModel = require("./models/tickets");

const mediator = new EventEmitter();

const dependencies = {
  adminRoutes,
  requestTimeLogger,
  loggerMiddleware,
  express,
  helmet,
  bodyParser,
  httpStatus,
  responseHandler,
  cors,
  jwt,
  base64,
  utf8,
  validators: validators(),
  bcrypt,
  expiresIn,
  secret,
  to,
  PdfMakePrinter,
  swagger,
  swaggerDocument,
  serverSettings,
  models: {
    users: userModel(mongoose),
    tickets: ticketModel(mongoose),
  },
};

/**
 * @author verbose logging when we are starting the server
 */
logger.info("--- FliqPay API ---");
logger.info("Connecting to FliqPay API repository...");

/**
 * @author log unhandled exceptions
 */
process.on("uncaughtException", (err) => {
  logger.error("Unhandled Exception", err);
});

process.on("uncaughtRejection", (err, promise) => {
  logger.error("Unhandled Rejection", err);
});

/**
 * @author event listener when the repository has been connected
 */
mediator.on("db.ready", (db) => {
  let rep;
  return repository
    .connect({ ...db, database, to })
    .then((repo) => {
      logger.info("Repository Connected. Starting Server");
      rep = repo;
      dependencies.repo = repo;
      dependencies.jwtHelper = jwtHelper(dependencies);
      dependencies.makePdf = makePdf(dependencies);
      return server.start(API, dependencies, {
        userController,
        ticketController,
        commentController,
      });
    })
    .then((app) => {
      logger.info(
        `Server started successfully, running on port: ${serverSettings.port}.`
      );
      app.on("close", () => {
        rep.disconnect();
      });
    });
});

/**
 * @author database error occurred
 */
mediator.on("db.error", (err) => {
  logger.error(err);
});

/**
 * @author we load the connection to the repository
 */
database.connect(
  {
    dbSettings,
    mongoose,
    serverSettings,
  },
  mediator
);

/**
 * @author init the repository connection, and the event listener will handle the rest
 */
mediator.emit("boot.ready");

/* eslint-disable no-unused-vars */
const start = (API, options, controllers) =>
  new Promise((resolve, reject) => {
    const {
      serverSettings: { port },
      repo,
      express,
      helmet,
      bodyParser,
      httpStatus,
      responseHandler,
    } = options;

    /**
     * @author we need to verify if we have a repository added and a server port
     */
    if (!repo) {
      reject(
        new Error("The server must be started with a connected repository")
      );
    }
    if (!port) {
      reject(new Error("The server must be started with an available port"));
    }

    /**
     * @author let's init a express app, and add some middleware
     */
    const app = express();
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    /**
     * @author we add our API's to the express app
     */

    API(app, options, controllers);

    /**
     * @author 404 handler
     */
    app.use((req, res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    /**
     * @author default error handler
     * @param {*} err
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    app.use((err, req, res, next) => {
      reject(new Error(`Something went wrong!, err: ${err}`));
      responseHandler.failure(
        res,
        {
          message: err.message || "Internal Server Error",
          response: err,
        },
        err.status || httpStatus.INTERNAL_SERVER_ERROR
      );
    });

    /**
     * @author set app headers
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    app.use((req, res, next) => {
      res.header("Content-Type", "application/json");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header(
        "Access-Control-Allow-Method",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
      );
      res.header("X-XSS-Protection", "1; mode=block");
      res.header("X-Frame-Options", "deny");
      res.header("X-Content-Type-Options", "nosniff");
      next();
    });

    /**
     * @author finally we start the server, and return the newly created server
     */
    const server = app.listen(port, () => resolve(server));
  });

module.exports = { start };

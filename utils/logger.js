const logger = (env, winston) => {
  const consoleTransport = new winston.transports.Console({
    level: "debug",
    type: `fliqPay${env}`,
    dumpExceptions: true,
    showStack: true,
  });

  const transports = {
    development: [consoleTransport],
    staging: [consoleTransport],
    production: [consoleTransport],
  };

  const winstonLogger = winston.createLogger({
    transports: transports[env],
    exceptionHandlers: transports[env],
  });

  const requestLoggerMeta = (req) => [
    `[${req.protocol}] [${req.method}]: ${req.url}`,
    {
      ip: req.header("x-forwarded-for") || req.connection.remoteAddress,
      query: req.query,
      params: req.params,
      body: req.body,
      tags: `fliqPay${env}`,
    },
  ];

  const requestTimeLogger = (req, res, next) => {
    function getDurationInMilliseconds(start) {
      const NS_PER_SEC = 1e9;
      const NS_TO_MS = 1e6;
      const diff = process.hrtime(start);
      return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    }
    winstonLogger.info(`${req.method} ${req.originalUrl} [STARTED]`);
    const start = process.hrtime();
    res.on("finish", () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      winstonLogger.info(
        `${req.method} ${req.originalUrl} ${
          res.statusCode
        } [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`
      );
    });
    res.on("error", () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      winstonLogger.error(
        `${req.method} ${req.originalUrl} ${
          res.statusCode
        } [ERROR] ${durationInMilliseconds.toLocaleString()} ms`
      );
    });
    res.on("close", () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      winstonLogger.info(
        `${req.method} ${req.originalUrl} ${
          res.statusCode
        } [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`
      );
    });

    next();
  };

  return Object.create({
    logger: winstonLogger,
    loggerMiddleware: (req, res, next) => {
      winstonLogger.info(...requestLoggerMeta(req));
      next();
    },
    requestTimeLogger,
  });
};

module.exports = { logger };

const dbSettings = {
  db: process.env.MONGODB_DATABASE_NAME,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  host: process.env.MONGODB_HOST,
  perpage: process.env.MONGODB_PAGE,
  port: process.env.MONGODB_PORT,
  dbOptions: process.env.MONGODB_OPTIONS,
  servers: null,
  dbParameters: () => ({
    w: "majority",
    wtimeout: 10000,
    j: true,
    native_parser: false,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }),
  serverParameters: () => ({
    poolSize: 10,
    keepAlive: 300,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  }),
};

const serverSettings = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};

const jwt = {
  secret: process.env.JWTSECRET,
  expiresIn: process.env.JWTEXPIRESIN,
};

module.exports = {
  dbSettings,
  serverSettings,
  jwt,
};

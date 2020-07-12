const getMongoURL = (options) => {
  const possible = ["staging", "production"];
  const {
    dbSettings: { db, user, host, port, servers, pass, dbOptions },
    serverSettings: { env },
  } = options;
  let url;
  if (servers instanceof Array) {
    url = servers.reduce(
      (prev, cur) => `${prev}${cur.ip}:${cur.port},`,
      "mongodb://"
    );
    return `${url.substr(0, url.length - 1)}/${options.db}`;
  }
  return possible.includes(env)
    ? `mongodb://${user}:${pass}@${host}/${db}?${dbOptions}`
    : `mongodb://${host}:${port}/${db}`;
};

// mongoDB function to connect, open and authenticate
const connect = (options, mediator) => {
  const {
    dbSettings: { dbParameters, serverParameters },
    mongoose,
  } = options;

  mediator.once("boot.ready", () => {
    mongoose.connect(
      getMongoURL(options),
      {
        useUnifiedTopology: true,
        ...dbParameters(),
        ...serverParameters(),
      },
      (err, db) => {
        if (err) {
          mediator.emit("db.error", err);
        }
        mediator.emit("db.ready", db);
      }
    );
  });
};

module.exports = Object.assign({}, { connect });

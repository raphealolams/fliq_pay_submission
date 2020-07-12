const { default: to } = require("await-to-js");

const jwtHelper = (options) => {
  const {
    jwt,
    secret,
    expiresIn,
    utf8,
    base64,
    httpStatus,
    responseHandler,
    adminRoutes,
    to,
    models: { users },
  } = options;

  const generateToken = (params) => {
    const jwtToken = jwt.sign(
      {
        data: params,
      },
      secret,
      { expiresIn }
    );
    const bytes = utf8.encode(jwtToken);
    const token = base64.encode(bytes);

    return {
      token,
      expiresIn,
    };
  };

  const verifyToken = (req, res, next) => {
    async function verifyCallBack(error, decoded) {
      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "Access Unauthorized",
            response: {},
          },
          httpStatus.UNAUTHORIZED
        );
      }
      const [err, user] = await to(
        users.findOne({ _id: decoded.data.userId, active: true })
      );

      if (!user || err) {
        return responseHandler.failure(
          res,
          {
            message: "Access Unauthorized",
            response: {},
          },
          httpStatus.UNAUTHORIZED
        );
      }
      const shouldNotAllow = adminRoutes.includes(req.path);

      if (shouldNotAllow && user.role !== "admin" && user.role !== "agent") {
        return responseHandler.failure(
          res,
          {
            message: "Access Unauthorized",
            response: {},
          },
          httpStatus.UNAUTHORIZED
        );
      }
      delete user._doc.password;
      req.authUser = user._doc;
      return next();
    }

    try {
      const { authorization } = req.headers;

      const bearer = authorization ? authorization.split(" ")[1] : null;
      if (!authorization || !bearer) {
        return responseHandler.failure(
          res,
          {
            message: "Authorization code is empty.",
            response: {},
          },
          httpStatus.UNAUTHORIZED
        );
      }

      const bytes = base64.decode(bearer);
      const token = utf8.decode(bytes);

      return jwt.verify(token, secret, verifyCallBack);
    } catch (error) {
      return next(error);
    }
  };

  return Object.create({
    generateToken,
    verifyToken,
  });
};

module.exports = jwtHelper;

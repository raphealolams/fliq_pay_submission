const userController = (options) => {
  const {
    responseHandler,
    httpStatus,
    repo,
    bcrypt,
    jwtHelper,
    validators,
    models: { users },
  } = options;

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that handles user registration
   * @author it also log user's in once registration is successful
   */
  const register = async (req, res, next) => {
    try {
      const { body } = req;

      const errors = validators.checkRequestBody(body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ]);
      const isEmail = validators.isEmail(body.email);
      if (errors || !isEmail) {
        return responseHandler.failure(
          res,
          {
            message: !isEmail
              ? "email string not valid"
              : "missing or empty request body",
            response: {
              errors,
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      if (body.password.localeCompare(body.confirmPassword) !== 0) {
        return responseHandler.failure(
          res,
          {
            message: "Password Mis-match",
            response: {
              errors: {},
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(body.password, salt);
      body.password = hash;
      const { error, data } = await repo.create(users, body);

      if (data) {
        data.password = undefined;
        const { token, expiresIn } = jwtHelper.generateToken({
          userId: data._id,
        });

        return responseHandler.success(
          res,
          {
            message: "user successfully created",
            response: {
              ...data._doc,
              bearerToken: `Bearer ${token}`,
              expiresIn,
            },
          },
          httpStatus.CREATED
        );
      }

      return responseHandler.failure(
        res,
        {
          message: "The email already exists.",
          response: {
            errors: error,
          },
        },
        httpStatus.UNPROCESSABLE_ENTITY
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that handles user login
   * @author it log user's in once credential's are valid
   */
  const login = async (req, res, next) => {
    try {
      const { body } = req;
      const errors = validators.checkRequestBody(body, ["email", "password"]);
      const isEmail = validators.isEmail(body.email);
      if (errors || !isEmail) {
        return responseHandler.failure(
          res,
          {
            message: !isEmail
              ? "email string not valid"
              : "missing or empty request body",
            response: {
              errors,
            },
          },
          httpStatus.BAD_REQUEST
        );
      }

      const { error, data } = await repo.findOne(
        users,
        { email: body.email, active: true },
        [],
        ""
      );
      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "error occurred",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (!data) {
        return responseHandler.failure(
          res,
          {
            message: "invalid email or password",
            response: { errors: {} },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const comparePassword = bcrypt.compareSync(body.password, data.password);

      if (comparePassword) {
        data.password = undefined;

        const { token, expiresIn } = jwtHelper.generateToken({
          userId: data._id,
        });

        return responseHandler.success(
          res,
          {
            message: "login successful",
            response: {
              ...data._doc,
              bearerToken: `Bearer ${token}`,
              expiresIn,
            },
          },
          httpStatus.OK
        );
      }

      return responseHandler.failure(
        res,
        {
          message: "invalid email or password",
          response: { errors: {} },
        },
        httpStatus.UNPROCESSABLE_ENTITY
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that handles user registration
   */
  const me = async (req, res, next) => {
    try {
      const { authUser } = req;
      const { error, data } = await repo.findOne(
        users,
        { email: authUser.email, active: true },
        ["firstName", "lastName", "email", "role", "createdAt", "_id"],
        ""
      );

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "error occurred",
            response: { errors: {} },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (!data) {
        responseHandler.failure(
          res,
          {
            message: "user not found",
            response: { errors: {} },
          },
          httpStatus.NOT_FOUND
        );
      }

      return responseHandler.success(
        res,
        {
          message: "user fetched",
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

  const allUsers = async (req, res, next) => {
    try {
      const {
        query: { page, limit, orderBy },
      } = req;

      const filterCondition = {};
      filterCondition.page = parseInt(page || 1);
      filterCondition.limit = parseInt(limit || 20);
      filterCondition.offset = parseInt(
        filterCondition.limit * filterCondition.page - filterCondition.limit
      );
      filterCondition.order = { firstName: orderBy === "asc" ? 1 : -1 };
      filterCondition.find = { active: true };

      const { error, data } = await repo.findAll(
        users,
        Object.assign(filterCondition),
        ["firstName", "lastName", "email", "role", "active"],
        "tickets"
      );
      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "error occurred",
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
          message: "users fetched",
          response: data,
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  const deleteUser = async (req, res, next) => {
    try {
      const {
        body: { email },
      } = req;

      const isEmail = validators.isEmail(email);
      if (!isEmail) {
        return responseHandler.failure(
          res,
          {
            message: "email string not valid",
            response: {},
          },
          httpStatus.BAD_REQUEST
        );
      }
      const { error } = await repo.update(users, { email }, { active: false });

      if (error) {
        return responseHandler.failure(
          res,
          {
            message: "error occurred",
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
          message: "user successfully deleted",
          response: {},
        },
        httpStatus.OK
      );
    } catch (error) {
      return next(error);
    }
  };

  return Object.create({
    register,
    login,
    me,
    allUsers,
    deleteUser,
  });
};

module.exports = userController;

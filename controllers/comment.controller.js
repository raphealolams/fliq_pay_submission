const commentController = (options) => {
  const {
    responseHandler,
    httpStatus,
    repo,
    validators,
    models: { tickets },
  } = options;

  /**
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next handler
   * @author function that handles comment creation
   * @author protected route
   */
  const createComment = async (req, res, next) => {
    try {
      const { body, authUser } = req;

      const errors = validators.checkRequestBody(body, ["comment", "ticketId"]);
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

      const { error, data } = await repo.findOne(
        tickets,
        {
          _id: body.ticketId,
        },
        [],
        "users"
      );

      if (error || !data) {
        return responseHandler.failure(
          res,
          {
            message: "error saving comment",
            response: {
              errors: error,
            },
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (data.comments.length === 0 && authUser.role === "user") {
        return responseHandler.failure(
          res,
          {
            message: "You can't comment unless a support agent does",
            response: {},
          },
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (
        data.comments.length > 0 ||
        (authUser.role === "admin" && data.comments.length === 0)
      ) {
        const ticketUpdate = await repo.update(
          tickets,
          { _id: body.ticketId },
          {
            $addToSet: {
              comments: {
                comment: body.comment,
                senderType: authUser.role,
                userId: authUser._id,
              },
            },
          }
        );

        return ticketUpdate.error
          ? responseHandler.failure(
              res,
              {
                message: "error saving comment",
                response: {
                  errors: ticketUpdate.error,
                },
              },
              httpStatus.UNPROCESSABLE_ENTITY
            )
          : responseHandler.success(
              res,
              {
                message: "comment saved",
                response: {},
              },
              httpStatus.OK
            );
      }

      return responseHandler.failure(
        res,
        {
          message: "error saving comment",
        },
        httpStatus.UNPROCESSABLE_ENTITY
      );
    } catch (error) {
      return next(error);
    }
  };

  return Object.create({
    createComment,
  });
};

module.exports = commentController;

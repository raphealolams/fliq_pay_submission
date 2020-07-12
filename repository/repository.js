/**
 * @author factory function, that holds an open connection to the db,
 * @author and exposes some functions for accessing the data.
 * @author we already know that we are going to query the `some` database table
 */
const repository = (options) => {
  const { to } = options;

  /**
   *
   * @param {*} params
   * @author first find user with the email, if user exist don't save
   * @author if user not exist save
   */
  const create = async (mongoDBModel, params) => {
    const saveSchema = mongoDBModel(params);
    const [error, data] = await to(saveSchema.save());

    return {
      error: error || null,
      data,
    };
  };

  /**
   *
   * @param {*} mongoDBModel
   * @param {*} where
   * @param {*} selectClause
   */
  const findOne = async (mongoDBModel, where, selectClause, path) => {
    const [error, data] = await to(
      mongoDBModel
        .findOne({
          ...where,
        })
        .select(selectClause.join(" "))
        .populate(path[0])
        .populate(path[1])
    );
    return {
      error: error || null,
      data,
    };
  };

  const findAll = async (mongoDBModel, params, selectClause, path) => {
    const [error, data] = await to(
      mongoDBModel
        .find(params.find)
        .skip(params.offset)
        .limit(params.limit)
        .sort(params.order)
        .select(selectClause.join(" "))
        .populate(path[0])
        .populate(path[1])
    );
    return {
      error: error || null,
      data,
    };
  };

  const destroy = async (mongoDBModel, params) => {
    const [error, data] = await to(mongoDBModel.deleteOne(params));

    return {
      error: error || null,
      data,
    };
  };

  const update = async (mongoDBModel, whereClause, dataToUpdate) => {
    const [error, data] = await to(
      mongoDBModel.updateOne(whereClause, dataToUpdate, { new: true })
    );

    return {
      error: error || null,
      data,
    };
  };

  const generateTicketReport = async (mongoDBModel) => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const [error, reports] = await to(
      mongoDBModel.find({
        status: "closed",
        updatedAt: {
          $gte: currentDate,
        },
      })
    );

    return {
      error: error || null,
      reports,
    };
  };

  // this will close the database connection
  const disconnect = () => {
    database.close();
  };

  return Object.create({
    disconnect,
    create,
    findOne,
    findAll,
    update,
    destroy,
    generateTicketReport,
  });
};

const connect = (connection) =>
  new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error("connection db not supplied!"));
    }
    resolve(repository(connection));
  });

// this only exports a connected repo
module.exports = { connect };

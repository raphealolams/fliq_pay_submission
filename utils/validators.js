const validators = () => {
  const isValidQuery = (query) => {
    const queryObject = query;
    if (queryObject.length < 1) return false;

    return queryObject;
  };

  const isEmptyValues = (value) => {
    return (
      value === undefined ||
      value === null ||
      value === NaN ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  };

  const checkRequestContent = (body) => {
    const errors = {};
    Object.keys(body).forEach((item) => {
      if (typeof body[item] === "object") {
        Object.keys(body[item]).forEach((v) => {
          if (isEmptyValues(body[item][v])) {
            errors[`${item}.${v}`] = "cannot be empty";
          }
        });
      }
      if (isEmptyValues(body[item])) {
        errors[item] = "cannot be empty";
      }
    });

    if (isEmptyValues(errors)) {
      return null;
    }

    return errors;
  };

  const checkRequestBody = (params, requiredFields) => {
    const errors = {};
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(params, requiredFields[i])) {
        errors[requiredFields[i]] = "is required";
      }
    }

    if (isEmptyValues(errors)) {
      return checkRequestContent(params);
    }
    return errors;
  };

  const isEmail = (email) => {
    if (!email) return false;
    if (email.length === 0) return false;
    const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return Object.create({
    isValidQuery,
    checkRequestBody,
    checkRequestContent,
    isEmail,
    isEmptyValues,
  });
};

module.exports = validators;

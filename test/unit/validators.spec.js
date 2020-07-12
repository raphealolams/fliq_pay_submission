const { expect } = require("chai");
const validators = require("../../utils/validators");
const v = validators();
const data = {
  fristName: "Raphael",
  lastName: "ajilore",
  email: "raphealolams@gmail.com",
  data: {
    fristName: "Raphael",
    lastName: "ajilore",
    email: "raphealolams@gmail.com",
  },
};

describe("Validator", () => {
  it("should validate a query string", (done) => {
    const query = v.isValidQuery(data);
    expect(query).to.be.an("object");
    done();
  });

  it("should validate that the request body is not empty", (done) => {
    const body = v.checkRequestContent(data);
    expect(body).to.be.null;
    done();
  });

  it("should validate that the nested object is not empty", (done) => {
    const body = v.checkRequestContent(data);
    expect(body).to.be.null;
    done();
  });

  it("should validate that the required request body is not empty", (done) => {
    const body = v.checkRequestBody(data, ["email"]);
    expect(body).to.be.null;
    done();
  });

  it("should throw error object when the required request body empty", (done) => {
    const body = v.checkRequestBody(data, ["role"]);
    expect(body).to.be.an("object");
    done();
  });

  it("should validate that the a valid email is passed", (done) => {
    const isEmail = v.isEmail(data.email);
    expect(isEmail).to.be.true;
    done();
  });
});

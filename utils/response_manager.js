
const respond = (res, data, httpCode, isFile) => {
  const response = {
    error: data.error,
    code: httpCode,
    message: data.message,
  };

  if (isFile) {
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(data);
  }
  res.setHeader('Content-Type', 'application/json');
  response.data = data.response;
  res.writeHead(httpCode);
  return res.end(JSON.stringify(response));
};

const success = (res, response, status = 200, isFile = false) => {
  const data = response;
  data.error = false;
  return respond(res, data, status, isFile);
};

const failure = (res, response, httpCode = 503, isFile = false) => {
  const data = response;
  data.error = true;
  return respond(res, data, httpCode, isFile);
};


module.exports = { success, failure };

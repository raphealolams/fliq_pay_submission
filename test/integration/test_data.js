const createUser = {
  firstName: 'Raphael',
  lastName: 'Ajilore',
  password: 'wemove',
  confirmPassword: 'wemove',
  email: 'raphealolams@outlook.com',
};

const createAdmin = {
  firstName: 'Raphael',
  lastName: 'Ajilore',
  password: 'wemove',
  confirmPassword: 'wemove',
  role: 'admin',
  email: 'raphealolams@gmail.com',
};

const userLogin = {
  password: 'wemove',
  email: 'raphealolams@outlook.com',
};

const adminLogin = {
  email: 'raphealolams@gmail.com',
  password: 'wemove',
};

const createTicket = {
  title: 'Man Power',
  description: 'is required',
};


module.exports = {
  createAdmin,
  createUser,
  userLogin,
  createTicket,
  adminLogin,
};

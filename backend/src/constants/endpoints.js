const { checkToken } = require("../controllers/user.controller");

const endpoints = {
  user: {
    register: "/register",
    login: "/login",
    checkToken: "/check",
  },
  books: {
    getAll: "/books",
    getByID: "/books/:id",
    post: "/books",
    put: "/books/:id",
    delete: "/books/:id",
  },
  reservation: {
    post: "/reservations",
    getMy: "/reservations/my",
    approve: "/reservations/:id/approve",
  },
  loans: {
    getMy: "/loans/my",
    return: "/loans/:id/return",
  },
};

module.exports = endpoints;

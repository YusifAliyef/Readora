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
    deleteReservation: "/reservations/:id",
  },
  loans: {
    getMy: "/loans/my",
    return: "/loans/:id/return",
  },
  reviews: {
    post: "/reviews",
    getByBook: "/reviews/book/:bookId",
    put: "/reviews/:id",
    delete: "/reviews/:id",
  },
  admin: {
    stats: "/admin/stats",
  },
  wishlist: {
    get: "/wishlist",
    post: "/wishlist",
    delete: "/wishlist/:id",
  },
};

module.exports = endpoints;

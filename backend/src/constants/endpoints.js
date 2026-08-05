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
    getAll: "/reservations", 
    approve: "/reservations/:id/approve",
    reject: "/reservations/:id/reject",
    deleteReservation: "/reservations/:id",
  },
  loans: {
    getMy: "/loans/my",
    getAll: "/loans",
    return: "/loans/:id/return",
  },
  reviews: {
    post: "/reviews",
    getByBook: "/reviews/book/:bookId",
    getMy: "/reviews/my",
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
  delivery: {
    getAll: "/deliveries",
    updateStatus: "/deliveries/:id",
  },
};

module.exports = endpoints;

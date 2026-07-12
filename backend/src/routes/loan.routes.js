const express = require("express");
const endpoints = require("../constants/endpoints");
const loansController = require("../controllers/loans.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateLoan = require("../middlewares/loans.middleware");

const loanRouter = express.Router();

// 1. İstifadəçinin öz icarə tarixcəsi (GET)
loanRouter.get(
  endpoints.loans.getMy,
  authMiddleware,
  loansController.getMyLoans,
);

// 2. Kitabı qaytar (PUT - Admin qeyd edir)
loanRouter.put(
  endpoints.loans.return,
  authMiddleware,
  validateLoan,
  loansController.returnBook,
);

module.exports = loanRouter;

const express = require("express");
const endpoints = require("../constants/endpoints");
const loanController = require("../controllers/loans.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateLoan = require("../middlewares/loans.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const loanRouter = express.Router();


loanRouter.get(endpoints.loans.getMy, authMiddleware, loanController.getMyLoans);
loanRouter.get(endpoints.loans.getAll, authMiddleware, isAdmin, loanController.getAllLoans);
loanRouter.put(endpoints.loans.return, authMiddleware, isAdmin, loanController.returnBook);


module.exports = loanRouter;

const express = require("express");
const endpoints = require("../constants/endpoints");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const adminRouter = express.Router();

adminRouter.get(
  endpoints.admin.stats,
  authMiddleware,
   isAdmin,
  adminController.getStats,
);

module.exports = adminRouter;

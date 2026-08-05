const express = require("express");
const endpoints = require("../constants/endpoints");
const deliveryController = require("../controllers/delivery.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const deliveryRouter = express.Router();

deliveryRouter.get(endpoints.delivery.getAll, authMiddleware, isAdmin, deliveryController.getAll);
deliveryRouter.put(endpoints.delivery.updateStatus, authMiddleware, isAdmin, deliveryController.updateStatus);

module.exports = deliveryRouter;
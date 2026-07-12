const express = require("express");
const endpoints = require("../constants/endpoints");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Əgər ayrıca roleMiddleware-in yoxdursa, authMiddleware-in req.user.role === 'admin' yoxlayırsa onu istifadə et
const adminRouter = express.Router();

adminRouter.get(
    endpoints.admin.stats,
    authMiddleware,
    adminController.getStats
);

module.exports = adminRouter;
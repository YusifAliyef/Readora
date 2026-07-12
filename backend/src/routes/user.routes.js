const express = require("express");
const endpoints = require("../constants/endpoints");
const userController = require("../controllers/user.controller");
const usersMiddleware = require("../middlewares/users.middleware");

const userRouter = express.Router();

userRouter.post(
  endpoints.user.register,
  usersMiddleware,
  userController.register,
);
userRouter.post(endpoints.user.login, userController.login);
userRouter.get(endpoints.user.checkToken, userController.checkToken);

module.exports = userRouter;

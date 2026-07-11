const express = require("express");
const endpoints = require("../constants/endpoints");
const reviewsController = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const reviewRouter = express.Router();

reviewRouter.post(
  endpoints.reviews.post,
  authMiddleware,
  reviewsController.create,
);

module.exports = reviewRouter;

const express = require("express");
const endpoints = require("../constants/endpoints");
const reviewsController = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const reviewsMiddleware = require("../middlewares/reviews.middleware");

const reviewRouter = express.Router();

// 1. POST - Rəy əlavə et
reviewRouter.post(
  endpoints.reviews.post,
  authMiddleware,
  reviewsMiddleware.validateCreate,
  reviewsController.create,
);

// 2. GET - Kitabın rəylərini gətir (Hər kəs görə bilər)
reviewRouter.get(endpoints.reviews.getByBook, reviewsController.getBookReviews);

// 3. PUT - Rəyi yenilə
reviewRouter.put(
  endpoints.reviews.put,
  authMiddleware,
  reviewsMiddleware.validateParams,
  reviewsMiddleware.validateUpdate,
  reviewsController.updateReview,
);

// 4. DELETE - Rəyi sil
reviewRouter.delete(
  endpoints.reviews.delete,
  authMiddleware,
  reviewsMiddleware.validateParams,
  reviewsController.deleteReview,
);

reviewRouter.get(
  endpoints.reviews.getMy,
  authMiddleware,
  reviewsController.getMyReviews,
);
module.exports = reviewRouter;

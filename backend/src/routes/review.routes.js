const express = require("express");
const endpoints = require("../constants/endpoints");
const reviewsController = require("../controllers/reviews.controller");
const reviewsMiddleware = require("../middlewares/reviews.middleware");

const reviewRouter = express.Router();

// 1. POST - Rəy əlavə et (token lazım deyil)
reviewRouter.post(
  endpoints.reviews.post,
  reviewsMiddleware.validateCreate,
  reviewsController.create,
);

// 2. GET - Kitabın rəylərini gətir (Hər kəs görə bilər)
reviewRouter.get(endpoints.reviews.getByBook, reviewsController.getBookReviews);

// 3. PUT - Rəyi yenilə (token lazım deyil)
reviewRouter.put(
  endpoints.reviews.put,
  reviewsMiddleware.validateParams,
  reviewsMiddleware.validateUpdate,
  reviewsController.updateReview,
);

// 4. DELETE - Rəyi sil (token lazım deyil)
reviewRouter.delete(
  endpoints.reviews.delete,
  reviewsMiddleware.validateParams,
  reviewsController.deleteReview,
);

// 5. GET - "Mənim rəylərim" (token lazım deyil, saxta sabit user ilə işləyir)
reviewRouter.get(endpoints.reviews.getMy, reviewsController.getMyReviews);

module.exports = reviewRouter;

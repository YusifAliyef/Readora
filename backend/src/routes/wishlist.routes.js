const express = require("express");
const endpoints = require("../constants/endpoints");
const wishlistController = require("../controllers/wishlist.controller");

// Middlewares
const authMiddleware = require("../middlewares/auth.middleware");
const wishlistMiddleware = require("../middlewares/wishlist.middleware");

const wishlistRouter = express.Router();

wishlistRouter.get(
  endpoints.wishlist.get,
  authMiddleware,
  wishlistController.getUsersWishlist,
);

wishlistRouter.post(
  endpoints.wishlist.post,
  authMiddleware,
  wishlistMiddleware.validateCreate,
  wishlistController.addToWishlist,
);

wishlistRouter.delete(
  endpoints.wishlist.delete,
  authMiddleware,
  wishlistMiddleware.validateParams,
  wishlistController.removeFromWishlist,
);

module.exports = wishlistRouter;

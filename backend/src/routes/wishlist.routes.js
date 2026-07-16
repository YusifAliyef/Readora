const express = require("express");
const endpoints = require("../constants/endpoints");
const wishlistController = require("../controllers/wishlist.controller");
const wishlistMiddleware = require("../middlewares/wishlist.middleware");

const wishlistRouter = express.Router();

wishlistRouter.get(endpoints.wishlist.get, wishlistController.getUsersWishlist);
wishlistRouter.post(
  endpoints.wishlist.post,
  wishlistMiddleware.validateCreate,
  wishlistController.addToWishlist,
);
wishlistRouter.delete(
  endpoints.wishlist.delete,
  wishlistMiddleware.validateParams,
  wishlistController.removeFromWishlist,
);

module.exports = wishlistRouter;

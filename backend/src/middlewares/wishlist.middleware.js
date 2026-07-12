const {
  wishlistBodySchema,
  wishlistParamsSchema,
} = require("../validation/wishlist.validation");

const wishlistMiddleware = {
  validateCreate: (req, res, next) => {
    const { error } = wishlistBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ messages: error.details.map((d) => d.message) });
    next();
  },
  validateParams: (req, res, next) => {
    const { error } = wishlistParamsSchema.validate(req.params, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ messages: error.details.map((d) => d.message) });
    next();
  },
};

module.exports = wishlistMiddleware;

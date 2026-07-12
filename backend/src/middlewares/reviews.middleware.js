const {
  reviewBodySchema,
  reviewUpdateSchema,
  reviewParamsSchema,
} = require("../validation/reviews.validation");

const reviewsMiddleware = {
  validateCreate: (req, res, next) => {
    const { error } = reviewBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ messages: error.details.map((d) => d.message) });
    next();
  },
  validateUpdate: (req, res, next) => {
    const { error } = reviewUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ messages: error.details.map((d) => d.message) });
    next();
  },
  validateParams: (req, res, next) => {
    const { error } = reviewParamsSchema.validate(req.params, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ messages: error.details.map((d) => d.message) });
    next();
  },
};

module.exports = reviewsMiddleware;

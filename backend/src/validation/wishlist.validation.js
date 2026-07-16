const Joi = require("joi");

const wishlistBodySchema = Joi.object({
  bookId: Joi.string().required(),
  userId: Joi.string().required(), 
});

const wishlistParamsSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  wishlistBodySchema,
  wishlistParamsSchema,
};
module.exports = { wishlistBodySchema, wishlistParamsSchema };

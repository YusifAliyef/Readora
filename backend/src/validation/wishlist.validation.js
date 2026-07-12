const Joi = require("joi");

const wishlistBodySchema = Joi.object({
  bookId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Kitab ID-si düzgün formatda deyil",
    "string.length": "Kitab ID-si 24 simvoldan ibarət olmalıdır",
    "any.required": "Kitab ID-si mütləqdir",
  }),
});

const wishlistParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "İstək siyahısı ID-si düzgün formatda deyil",
    "string.length": "İstək siyahısı ID-si 24 simvoldan ibarət olmalıdır",
  }),
});

module.exports = { wishlistBodySchema, wishlistParamsSchema };

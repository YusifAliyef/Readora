const Joi = require("joi");

const reviewBodySchema = Joi.object({
  bookId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Kitab ID-si düzgün formatda deyil",
    "string.length": "Kitab ID-si 24 simvoldan ibarət olmalıdır",
    "any.required": "Kitab ID-si mütləqdir",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Qiymət ən az 1 ola bilər",
    "number.max": "Qiymət ən çox 5 ola bilər",
    "any.required": "Reytinq xanası boş buraxıla bilməz",
  }),
  comment: Joi.string().min(3).trim().required().messages({
    "string.min": "Rəy ən azı 3 simvoldan ibarət olmalıdır",
    "any.required": "Rəy mətni mütləqdir",
  }),
});

const reviewUpdateSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().min(3).trim().optional(),
});

const reviewParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Rəy ID-si düzgün formatda deyil",
    "string.length": "Rəy ID-si 24 simvoldan ibarət olmalıdır",
  }),
});

module.exports = { reviewBodySchema, reviewUpdateSchema, reviewParamsSchema };

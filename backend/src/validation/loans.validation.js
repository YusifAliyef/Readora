const Joi = require("joi");

const loanValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "İcarə ID-si düzgün formatda deyil",
    "string.length": "İcarə ID-si 24 simvoldan ibarət olmalıdır",
    "any.required": "İcarə ID-si mütləq göndərilməlidir",
  }),
});

module.exports = loanValidation;

const loanValidation = require("../validation/loans.validation");

const validateLoan = (req, res, next) => {
  const { error } = loanParamsSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "Validation Error",
      messages: errorMessages,
    });
  }

  next();
};

module.exports = validateLoan;

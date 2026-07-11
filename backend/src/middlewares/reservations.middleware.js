const reservationSchema = require("../validation/reservation.validation");

const validateReservation = async (req, res, next) => {
  const { error } = reservationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "Validation Error",
      messages: errorMessages,
    });
  }

  next();
};

module.exports = validateReservation;

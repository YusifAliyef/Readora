const express = require("express");
const endpoints = require("../constants/endpoints");
const reservationsController = require("../controllers/reservations.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateReservation = require("../middlewares/reservations.middleware");

const reservationRouter = express.Router();

// 1. Kitab rezerv et (Giriş etmiş hər bir istifadəçi)
reservationRouter.post(
  endpoints.reservation.post,
  authMiddleware,
  validateReservation,
  reservationsController.create,
);

// 2. İstifadəçinin öz rezervasiyalarını gətirməsi
reservationRouter.get(
  endpoints.reservation.getMy,
  authMiddleware,
  reservationsController.getMyReservations,
);

// 3. Rezervasiyanı təsdiqlə (Giriş etmiş şəxs - sonradan bura Admin yoxlanışı gələcək)
reservationRouter.put(
  endpoints.reservation.approve,
  authMiddleware,
  reservationsController.approve,
);
// 4. DELETE - Rezervasiyanı sil/ləğv et (Yeni əlavə olundu)
reservationRouter.delete(
  endpoints.reservation.deleteReservation, // Əgər endpoints.js-də yoxdursa birbaşa belə yaza bilərsən
  authMiddleware,
  reservationsController.deleteReservation,
);

module.exports = reservationRouter;

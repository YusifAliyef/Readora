const express = require("express");
const endpoints = require("../constants/endpoints");
const reservationsController = require("../controllers/reservations.controller");
const validateReservation = require("../middlewares/reservations.middleware");

const reservationRouter = express.Router();

// 1. Kitab rezerv et - authMiddleware SİLİNDİ
reservationRouter.post(
  endpoints.reservation.post,
  validateReservation,
  reservationsController.create,
);

// 2. İstifadəçinin öz rezervasiyalarını gətirməsi - authMiddleware SİLİNDİ
reservationRouter.get(
  endpoints.reservation.getMy,
  reservationsController.getMyReservations,
);

// 3. Rezervasiyanı təsdiqlə - authMiddleware SİLİNDİ
reservationRouter.put(
  endpoints.reservation.approve,
  reservationsController.approve,
);

// 4. Rezervasiyanı sil/ləğv et - authMiddleware SİLİNDİ
reservationRouter.delete(
  endpoints.reservation.deleteReservation,
  reservationsController.deleteReservation,
);

module.exports = reservationRouter;

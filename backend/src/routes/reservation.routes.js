const express = require("express");
const endpoints = require("../constants/endpoints");
const reservationsController = require("../controllers/reservations.controller");
const validateReservation = require("../middlewares/reservations.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const reservationRouter = express.Router();

// 1. Kitab rezerv et - açıqdır (token lazım deyil)
reservationRouter.post(
  endpoints.reservation.post,
  validateReservation,
  reservationsController.create,
);

// 2. İstifadəçinin öz rezervasiyalarını gətirməsi - açıqdır (token lazım deyil)
reservationRouter.get(
  endpoints.reservation.getMy,
  reservationsController.getMyReservations,
);

// 3. BÜTÜN rezervasiyalar - yalnız ADMIN
reservationRouter.get(
  endpoints.reservation.getAll,
  authMiddleware,
  isAdmin,
  reservationsController.getAll,
);

// 4. Rezervasiyanı təsdiqlə - yalnız ADMIN
reservationRouter.put(
  endpoints.reservation.approve,
  authMiddleware,
  isAdmin,
  reservationsController.approve,
);

// 5. Rezervasiyanı rədd et - yalnız ADMIN
reservationRouter.put(
  endpoints.reservation.reject,
  authMiddleware,
  isAdmin,
  reservationsController.reject,
);

// 6. Rezervasiyanı sil / ləğv et - yalnız ADMIN
reservationRouter.delete(
  endpoints.reservation.deleteReservation,
  authMiddleware,
  isAdmin,
  reservationsController.deleteReservation,
);

module.exports = reservationRouter;
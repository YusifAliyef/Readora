const Reservation = require("../models/reservation.model");
const Book = require("../models/books.model");
const Delivery = require("../models/delivery.model");
const Loan = require("../models/loan.model");

const LOAN_PERIOD_DAYS = 14;

const reservationsController = {
  create: async (req, res) => {
    try {
      const { bookId, deliveryMethod, address, phone } = req.body;
      const userId = req.user?.id || "645d1a2b3c4d5e6f7a8b9c0d";

      const book = await Book.findById(bookId);
      if (!book || book.stock < 1) {
        return res
          .status(400)
          .json({ message: "Kitab tapılmadı və ya stokda yoxdur" });
      }

      if (deliveryMethod === "delivery" && !address) {
        return res
          .status(400)
          .json({ message: "Çatdırılma üçün ünvan daxil edilməlidir" });
      }

      const newReservation = new Reservation({
        user: userId,
        book: bookId,
        deliveryMethod: deliveryMethod === "delivery" ? "delivery" : "pickup",
        address: address || "",
        phone: phone || "",
      });
      await newReservation.save();
      res.status(201).json({
        message: "Rezervasiya sorğusu göndərildi",
        reservation: newReservation,
      });
    } catch (error) {
      console.error("Xəta baş verdi", error);
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  getMyReservations: async (req, res) => {
    try {
      const userId = req.user?.id || "645d1a2b3c4d5e6f7a8b9c0d";

      const reservations = await Reservation.find({
        user: userId,
      }).populate("book", "title author price");

      res.status(200).json(reservations);
    } catch (error) {
      console.error("Rezervasiya gətirmə xətası:", error);
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};

      const reservations = await Reservation.find(filter)
        .populate("book", "title author price image")
        .populate("user", "userName fullName")
        .sort({ createdAt: -1 });

      res.status(200).json(reservations);
    } catch (error) {
      console.error("Bütün rezervasiyaları gətirmə xətası:", error);
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },

  approve: async (req, res) => {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervasiya tapılmadı" });
      }

      if (
        reservation.status === "approve" ||
        reservation.status === "approved"
      ) {
        return res
          .status(400)
          .json({ message: "Bu rezervasiya artıq təsdiqlənib" });
      }

      const book = await Book.findById(reservation.book);
      if (!book || book.stock < 1) {
        return res.status(400).json({ message: "Kitab stokda yoxdur" });
      }

      reservation.status = "approve";
      await reservation.save();

      await Book.findByIdAndUpdate(reservation.book, { $inc: { stock: -1 } });

      if (reservation.deliveryMethod === "delivery") {
        const existingDelivery = await Delivery.findOne({
          reservation: reservation._id,
        });
        if (!existingDelivery) {
          await Delivery.create({
            reservation: reservation._id,
            user: reservation.user,
            book: reservation.book,
            address: reservation.address,
            phone: reservation.phone,
          });
        }
      } else {
        const existingLoan = await Loan.findOne({
          user: reservation.user,
          book: reservation.book,
          status: "borrowed",
        });
        if (!existingLoan) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);

          await Loan.create({
            user: reservation.user,
            book: reservation.book,
            dueDate,
          });
        }
      }

      const updated = await Reservation.findById(id)
        .populate("book", "title author price image")
        .populate("user", "userName fullName");

      res.status(200).json({
        message: "Rezervasiya təsdiqləndi və stok yeniləndi",
        reservation: updated,
      });
    } catch (error) {
      console.error("Xəta baş verdi", error);
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  reject: async (req, res) => {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervasiya tapılmadı" });
      }

      reservation.status = "rejected";
      await reservation.save();

      res.status(200).json({
        message: "Rezervasiya rədd edildi",
        reservation,
      });
    } catch (error) {
      console.error("Rədd etmə xətası:", error);
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  deleteReservation: async (req, res) => {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervasiya tapılmadı" });
      }

      if (
        reservation.status === "approved" ||
        reservation.status === "approve"
      ) {
        await Book.findByIdAndUpdate(reservation.book, { $inc: { stock: 1 } });
      }

      await Delivery.findOneAndDelete({ reservation: reservation._id });

      await Reservation.findByIdAndDelete(id);

      res.status(200).json({ message: "Rezervasiya uğurla silindi" });
    } catch (error) {
      console.error("Silmə zamanı xəta:", error);
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },
};

module.exports = reservationsController;

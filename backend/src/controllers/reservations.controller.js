const Reservation = require("../models/reservation.model");
const Book = require("../models/books.model");

const reservationsController = {
  // 1. Kitab rezerv et
  create: async (req, res) => {
    try {
      const { bookId } = req.body;
     const userId = req.user.userId;

      // Kitabın olub-olmadığını və stokunu yoxlayaq
      const book = await Book.findById(bookId);
      if (!book || book.stock < 1) {
        return res
          .status(400)
          .json({ message: "Kitab tapılmadı və ya stokda yoxdur" });
      }
      const newReservation = new Reservation({
        user: userId,
        book: bookId,
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
  // 2. İstifadəçinin öz rezervasiyaları
  getMyReservations: async (req, res) => {
    try {
      const reservations = await Reservation.find({
        user: req.user.id,
      }).populate("book", "title author price"); // Kitabın detallarını da birlikdə gətirir
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
  // 3. Rezervasiyanı təsdiqlə (Admin üçün)
  approve: async (req, res) => {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervasiya tapılmadı" });
      }

      reservation.status = "approve";
      await reservation.save();

      // Kitabın stokunu 1 ədəd azaldırıq
      await Book.findByIdAndUpdate(reservation.book, { $inc: { stock: -1 } });

      res.status(200).json({
        message: "Rezervasiya təsdiqləndi və stok yeniləndi",
        reservation,
      });
    } catch (error) {
      console.error("Xəta baş verdi", error);
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
};

module.exports=reservationsController
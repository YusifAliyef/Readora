const Reservation = require("../models/reservation.model");
const Book = require("../models/books.model");

const reservationsController = {
  // 1. Kitab rezerv et
  create: async (req, res) => {
    try {
      const { bookId } = req.body;
      const userId = req.user?.id || "645d1a2b3c4d5e6f7a8b9c0d";

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
  // Rezervasiyanı sil / ləğv et
  deleteReservation: async (req, res) => {
    try {
      const { id } = req.params;
      const userId =
        req.user?.userId ||
        req.user?.id ||
        req.user?._id ||
        "645d1a2b3c4d5e6f7a8b9c0d";

      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervasiya tapılmadı" });
      }

      if (reservation.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Bu əməliyyat üçün icazəniz yoxdur" });
      }

      // Əgər admin tərəfindən təsdiqlənmiş rezervasiya silinirsə, kitab stoku geri qaytarılır
      // (Qeyd: 'approve' metodunda statusu "approve" etdiyin üçün burada həm "approve", həm də "approved" yoxlayırıq)
      if (
        reservation.status === "approved" ||
        reservation.status === "approve"
      ) {
        await Book.findByIdAndUpdate(reservation.book, { $inc: { stock: 1 } });
      }

      await Reservation.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Rezervasiya uğurla ləğv edildi və silindi" });
    } catch (error) {
      console.error("Silmə zamanı xəta:", error);
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },
};

module.exports = reservationsController;

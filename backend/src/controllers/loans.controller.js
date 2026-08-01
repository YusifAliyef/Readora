const Loan = require("../models/loan.model");
const Book = require("../models/books.model");
const { getDaysDifference } = require("../utils/date.helpers");

const DAILY_FINE_RATE = 0.5;

const loanController = {
  // 1. İstifadəçinin öz icarə tarixçəsi və canlı cərimə hesabı
  getMyLoans: async (req, res) => {
    try {
      const loans = await Loan.find({ user: req.user.id }).populate(
        "book",
        "title author",
      );

      const updatedLoans = loans.map((loan) => {
        let currentFine = loan.fine;

        if (loan.status === "borrowed" && new Date() > loan.dueDate) {
          const diffTime = Math.abs(new Date() - loan.dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          currentFine = diffDays * DAILY_FINE_RATE;
        }

        return {
          ...loan._doc,
          fine: currentFine,
        };
      });

      res.status(200).json(updatedLoans);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  // 2. Admin üçün — bütün icarələr (filtr: status)
  getAllLoans: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};

      const loans = await Loan.find(filter)
        .populate("book", "title author")
        .populate("user", "userName fullName")
        .sort({ createdAt: -1 });

      const updatedLoans = loans.map((loan) => {
        let currentFine = loan.fine;

        if (loan.status === "borrowed" && new Date() > loan.dueDate) {
          const diffTime = Math.abs(new Date() - loan.dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          currentFine = diffDays * DAILY_FINE_RATE;
        }

        return { ...loan._doc, fine: currentFine };
      });

      res.status(200).json(updatedLoans);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },

  // 3. Kitabı qaytarmaq (Admin qeyd edir)
  returnBook: async (req, res) => {
    try {
      const { id } = req.params;
      const currentDate = new Date();

      const loan = await Loan.findById(id);
      if (!loan) {
        return res.status(404).json({ message: "İcarə qeydi tapılmadı" });
      }

      if (loan.status === "returned") {
        return res.status(400).json({ message: "Bu kitab artıq qaytarılıb" });
      }

      // Modeldəki dəqiq sahə adı: dueDate
      const overdueDays = getDaysDifference(loan.dueDate, currentDate);

      let fineAmount = 0;
      if (overdueDays > 0) {
        fineAmount = overdueDays * DAILY_FINE_RATE;
      }

      loan.returnDate = currentDate;
      loan.status = "returned";
      loan.fine = fineAmount;

      await loan.save();

      // Kitabın stokunu 1 ədəd artırırıq (books.model-də sahə adı: stock)
      await Book.findByIdAndUpdate(loan.book, { $inc: { stock: 1 } });

      const updated = await Loan.findById(id)
        .populate("book", "title author")
        .populate("user", "userName fullName");

      res.status(200).json({
        message: "Kitab uğurla qaytarıldı",
        overdueDays,
        fineAmount,
        loan: updated,
      });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },
};

module.exports = loanController;
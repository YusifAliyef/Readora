const Loan = require("../models/loan.model");
const Book = require("../models/books.model");
const { getDaysDifference } = require("../utils/date.helpers");

const loanController = {
  // 1. İstifadəçinin öz icarə tarixçəsi və canlı cərimə hesabı
  getMyLoans: async (req, res) => {
    try {
      const loans = await Loan.find({ user: req.user.id }).populate(
        "book",
        "title author",
      );

      // Günlük gecikmə cəriməsi tarifi (Məsələn: hər gecikən gün üçün 0.50 AZN)
      const DAILY_FINE_RATE = 0.5;

      const updatedLoans = loans.map((loan) => {
        let currentFine = loan.fine;

        // Əgər kitab hələ qaytarılmayıbsa və son tarix keçibsə, cəriməni canlı hesablayırıq
        if (loan.status === "borrowed" && new Date() > loan.dueDate) {
          const diffTime = Math.abs(new Date() - loan.dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Gün fərqi
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
  // 2. Kitabı qaytarmaq (Admin qeyd edir)
  returnBook: async (req, res) => {
    try {
      const { id } = req.params;
      const currentDate = new Date(); // Bu günün tarixi

      const loan = await Loan.findById(id);
      if (!loan) {
        return res.status(404).json({ message: "İcarə qeydi tapılmadı" });
      }

      if (loan.status === "returned") {
        return res.status(400).json({ message: "Bu kitab artıq qaytarılıb" });
      }

      // 2. Helper funksiyasından istifadə edərək gecikmə gününü hesablayırıq
      // loan.due_date -> qaytarılmalı olan son tarix
      const overdueDays = getDaysDifference(loan.due_date, currentDate);

      let fineAmount = 0;
      if (overdueDays > 0) {
        // Məsələn: hər gecikmiş gün üçün 0.50 AZN cərimə
        fineAmount = overdueDays * 0.5;
      }

      // İcarə məlumatlarını yeniləyirik
      loan.return_date = currentDate;
      loan.status = "returned";

      // Əgər modelində fine (cərimə) xanaları varsa, bura mənimsədirik
      loan.fine = fineAmount;

      await loan.save();

      // Kitabın mövcud sayını (available_copies) 1 ədəd artırırıq
      await Book.findByIdAndUpdate(loan.book, {
        $inc: { available_copies: 1 },
      });

      res.status(200).json({
        message: "Kitab uğurla qaytarıldı",
        overdueDays,
        fineAmount,
        loan,
      });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },
};

module.exports = loanController;

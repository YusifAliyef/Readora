const Review = require("../models/review.model");
const Book = require("../models/books.model");

const reviewsController = {
  create: async (req, res) => {
    try {
      const { bookId, rating, comment } = req.body;

      const userId = req.user.userId;

      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Kitab tapılmadı" });
      }

      const existingReview = await Review.findOne({
        user: userId,
        book: bookId,
      });

      if (existingReview) {
        return res
          .status(400)
          .json({ message: "Siz bu kitaba artıq rəy bildirmisiniz" });
      }
      const newReview = new Review({
        user: userId,
        book: bookId,
        rating,
        comment,
      });

      await newReview.save();
      res.status(201).json({ message: "Rəyiniz uğurla əlavə olundu" });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
};

module.exports = reviewsController;

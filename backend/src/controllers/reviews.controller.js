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
      res
        .status(201)
        .json({ message: "Rəyiniz uğurla əlavə olundu", review: newReview });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  getBookReviews: async (req, res) => {
    try {
      const { bookId } = req.params;
      const reviews = await Review.find({ book: bookId }).populate(
        "user",
        "userName",
      );
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  // YENİ ƏLAVƏ OLUNDU — Navbar-dakı "Mənim Rəylərim" üçün
  getMyReviews: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id || req.user._id;
      const reviews = await Review.find({ user: userId })
        .populate("book", "title author image")
        .sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId || req.user.id || req.user._id;
      const { rating, comment } = req.body;

      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Rəy tapılmadı" });

      if (review.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Bu əməliyyat üçün icazəniz yoxdur" });
      }

      if (rating) review.rating = rating;
      if (comment) review.comment = comment;

      await review.save();

  
      const updatedReview = await Review.findById(id).populate(
        "book",
        "title author image",
      );

      res
        .status(200)
        .json({ message: "Rəyiniz uğurla yeniləndi", review: updatedReview });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId || req.user.id || req.user._id;

      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Rəy tapılmadı" });

      if (review.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Bu əməliyyat üçün icazəniz yoxdur" });
      }

      await Review.findByIdAndDelete(id);
      res.status(200).json({ message: "Rəy uğurla silindi" });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
};

module.exports = reviewsController;

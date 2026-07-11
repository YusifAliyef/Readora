const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Bir istifadəçi bir kitaba yalnız BİR DƏFƏ rəy yaza bilsin
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

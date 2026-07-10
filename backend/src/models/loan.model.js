const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
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
    loanDate: {
      type: Date,
      default: Date.now, // Kitabın götürüldüyü tarix
    },
    dueDate: {
      type: Date,
      required: true, // Qaytarılmalı olduğu son tarix (məsələn, 14 gün sonra)
    },
    returnDate: {
      type: Date, // Faktiki qaytarıldığı tarix (hələ qaytarmayıbsa null olur)
    },
    fine: {
      type: Number,
      default: 0, // Gecikmə cəriməsi (AZN ilə)
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Loan=mongoose.model("Loan", loanSchema);

module.exports=Loan;


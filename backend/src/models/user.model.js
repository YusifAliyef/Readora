const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
    },
  },
  {
    timestamps: true, // created_at və updated_at tarixlərini avtomatik idarə edir
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;

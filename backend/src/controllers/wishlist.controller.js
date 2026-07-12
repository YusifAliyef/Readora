const Wishlist = require("../models/wishlist.model");
const Book = require("../models/books.model");

const wishlistController = {
  // 1. İstifadəçinin öz istək siyahısını gətir
  getUsersWishlist: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id || req.user._id;
      const list = await Wishlist.find({ user: userId }).populate(
        "book",
        "title author cover_image",
      );
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  // 2. İstək siyahısına kitab əlavə et
  addToWishlist: async (req, res) => {
    try {
      const { bookId } = req.body;
      const userId = req.user.userId || req.user.id || req.user._id;

      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Kitab tapılmadı" });

      const existingItem = await Wishlist.findOne({
        user: userId,
        book: bookId,
      });
      if (existingItem)
        return res
          .status(400)
          .json({ message: "Bu kitab artıq istək siyahınızdadır" });

      const newItem = new Wishlist({ user: userId, book: bookId });
      const savedItem = await newItem.save();

      res
        .status(201)
        .json({
          message: "Kitab istək siyahısına əlavə olundu",
          item: savedItem,
        });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  // 3. İstək siyahısından kitab sil
  removeFromWishlist: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId || req.user.id || req.user._id;

      const item = await Wishlist.findById(id);
      if (!item) return res.status(404).json({ message: "Qeyd tapılmadı" });

      if (item.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Bu əməliyyat üçün icazəniz yoxdur" });
      }

      await Wishlist.findByIdAndDelete(id);
      res.status(200).json({ message: "Kitab istək siyahısından çıxarıldı" });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
};

module.exports = wishlistController;

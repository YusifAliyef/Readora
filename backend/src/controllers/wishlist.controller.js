const Wishlist = require("../models/wishlist.model");
const Book = require("../models/books.model");

const wishlistController = {
  // GET: Bütün istifadəçi siyahısını gətir (Frontend-dən userId query olaraq gələcək)
  getUsersWishlist: async (req, res) => {
    try {
      const { userId } = req.query;
      const list = await Wishlist.find({ user: userId }).populate(
        "book",
        "title author image description",
      );
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
  // POST: Siyahıya əlavə et
  addToWishlist: async (req, res) => {
    try {
      const { bookId, userId } = req.body;
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Kitab tapılmadı" });

      const newItem = new Wishlist({ user: userId, book: bookId });
      const savedItem = await newItem.save();
      res.status(201).json({ message: "Əlavə olundu", item: savedItem });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },

  // DELETE: Siyahıdan sil
  removeFromWishlist: async (req, res) => {
    try {
      const { id } = req.params;
      await Wishlist.findByIdAndDelete(id);
      res.status(200).json({ message: "Kitab siyahıdan çıxarıldı" });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi" });
    }
  },
};

module.exports = wishlistController;

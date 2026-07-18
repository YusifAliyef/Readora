const Book = require("../models/books.model");

const bookController = {
  //Bütün Kitabları Gətirmək (Axtarış və Pagination ilə)
  getAll: async (req, res) => {
    try {
      // URL-dən gələn query parametrlərini götürürük (Məsələn: ?page=1&limit=5&search=Dədə)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const search = req.query.search || "";
      // Axtarış üçün filtri hazırlayırıq (böyük/kiçik hərf fərqi olmadan - "i")
      const searchFilter = {
        title: { $regex: search, $options: "i" },
      };

      // Lazımi sayda kitabı ötürürük və sıralayırıq (ən son əlavə olunan birinci gəlir)-- (LIFO)
      const books = await Book.find(searchFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      // Toplam neçə kitab olduğunu tapırıq (frontend-də səhifə sayını hesablamaq üçün)
      const totalBooks = await Book.countDocuments(searchFilter);

      res.status(200).json({
        message: "Books fetched successfully",
        currentPage: page,
        totalPage: Math.ceil(totalBooks / limit),
        totalItems: totalBooks,
        books,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Error fetching books" });
    }
  },
  //Tək Bir Kitabı ID-yə Görə Gətirmək
  getByID: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Books not found" });
      }
      res.status(200).json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Error fetching book" });
    }
  },
  //Yeni Kitab Əlavə Etmək
  post: async (req, res) => {
    try {
      const { title, author, description, price, image, stock } = req.body;

      const newBook = new Book({
        title,
        author,
        description,
        price,
        image,
        stock,
      });
      await newBook.save();
      res
        .status(201)
        .json({ message: "Book created successfully", book: newBook });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Error creating book" });
    }
  },
  //Kitab Məlumatlarını Yeniləmək
  put: async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      ); // new: true yenilənmiş datanı geri qaytarır

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Error updating book" });
    }
  },
  //Kitabı Silmək
  delete: async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book", error);
      res.status(500).json({ message: "Error deleting book" });
    }
  },
};

module.exports=bookController;
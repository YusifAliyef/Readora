const express = require("express");
const endpoints = require("../constants/endpoints");
const booksController = require("../controllers/books.controller");
const booksMiddleware = require("../middlewares/books.middleware"); // Joi üçün
const authMiddleware = require("../middlewares/auth.middleware");   // JWT üçün

const bookRouter = express.Router();

// Hər kəs kitabları görə bilər (Nə token lazımdır, nə Joi)
bookRouter.get(endpoints.books.getAll, booksController.getAll);
bookRouter.get(endpoints.books.getByID, booksController.getByID);

// Kitab yaratmaq üçün HƏM sistemə giriş etməlidir (authMiddleware), HƏM DƏ datalar düzgün olmalıdır (booksMiddleware)
bookRouter.post(endpoints.books.post, authMiddleware, booksMiddleware, booksController.post);

// Kitab yeniləmək üçün HƏM token lazımdır, HƏM DƏ Joi doğrulaması
bookRouter.put(endpoints.books.put, authMiddleware, booksMiddleware, booksController.put);

// Kitab silmək üçün sadəcə token lazımdır, çünki body-də data göndərilmir (Joi-yə ehtiyac yokdur)
bookRouter.delete(endpoints.books.delete, authMiddleware, booksController.delete);

module.exports = bookRouter;
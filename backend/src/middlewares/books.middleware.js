const bookValidation = require("../validation/books.validation");

const booksMiddleware = async (req, res, next) => {
    const { error } = bookValidation(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

module.exports = booksMiddleware;
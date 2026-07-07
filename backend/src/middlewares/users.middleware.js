const { registerValidation } = require("../validation/users.validation");

const usersMiddleware = (req, res, next) => {
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    next();
};

module.exports = usersMiddleware;
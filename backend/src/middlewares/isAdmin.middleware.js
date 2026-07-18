const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Bu əməliyyat üçün admin icazəniz yoxdur" });
  }
  next();
};

module.exports = isAdmin;
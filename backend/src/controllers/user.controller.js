const User = require("../models/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/users.validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    const { userName, password } = req.body;

    try {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "İstifadəçi adı artıq mövcuddur" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        userName,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({
        message: "İstifadəçi hersabı uğurla yaradıldı",
        user: newUser,
      });
    } catch (error) {
      console.error("Qeydiyyat xətası:", error);
      res
        .status(500)
        .json({ message: "İstifadəçinin qeydiyyatı zamanı xəta baş verdi" });
    }
  },

  login: async (req, res) => {
    const { userName, password } = req.body;

    try {
      const user = await User.findOne({ userName });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Yanlış istifadəçi adı və ya parol" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      const token = jwt.sign(
        { userId: user._id, userName: user.userName, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      if (isValidPassword) {
        res.status(201).json({
          message: "Uğurla daxil oldunuz",
          userName: user.userName,
          fullName: user.fullName,
          role: user.role, 
          id: user._id,
          token,
        });
      }
    } catch (error) {
      console.error("Giriş zamanı xəta baş verdi", error);
      res.status(500).json({ message: "Giriş zamanı xəta baş verdi" });
    }
  },
  checkToken: (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, "Yusif123");

      return res.status(200).json({
        message: "Token is valid",
        isValid: true,
        user: decoded,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  },
};

module.exports = userController;

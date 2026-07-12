const Book = require("../models/books.model");
const User = require("../models/user.model");
const Reservation = require("../models/reservation.model");
const Loan = require("../models/loan.model");

const adminController = {
    getStats: async (req, res) => {
        try {
            // Parallel olaraq bütün sayları bazadan çəkirik (Performans üçün Promise.all)
            const [totalBooks, totalUsers, pendingReservations, activeLoans] = await Promise.all([
                Book.countDocuments(),
                User.countDocuments(),
                Reservation.countDocuments({ status: "pending" }),
                Loan.countDocuments({ status: "borrowed" })
            ]);

            res.status(200).json({
                totalBooks,
                totalUsers,
                pendingReservations,
                activeLoans
            });
        } catch (error) {
            res.status(500).json({ message: "Statistika gətirilərkən xəta baş verdi", error: error.message });
        }
    }
};

module.exports = adminController;
const Delivery = require("../models/delivery.model");
const Loan = require("../models/loan.model");

const LOAN_PERIOD_DAYS = 14;

const deliveryController = {
  getAll: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};

      const deliveries = await Delivery.find(filter)
        .populate("book", "title author")
        .populate("user", "userName fullName")
        .sort({ createdAt: -1 });

      res.status(200).json(deliveries);
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, courierName } = req.body;

      const delivery = await Delivery.findById(id);
      if (!delivery) {
        return res.status(404).json({ message: "Çatdırılma qeydi tapılmadı" });
      }

      const wasAlreadyDelivered = delivery.status === "delivered";

      if (status) delivery.status = status;
      if (courierName !== undefined) delivery.courierName = courierName;

      if (status === "delivered") {
        delivery.deliveredAt = new Date();
      }

      await delivery.save();

      if (status === "delivered" && !wasAlreadyDelivered) {
        const existingLoan = await Loan.findOne({
          user: delivery.user,
          book: delivery.book,
          status: "borrowed",
        });
        if (!existingLoan) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);

          await Loan.create({
            user: delivery.user,
            book: delivery.book,
            dueDate,
          });
        }
      }

      const updated = await Delivery.findById(id)
        .populate("book", "title author")
        .populate("user", "userName fullName");

      res.status(200).json({ message: "Status yeniləndi", delivery: updated });
    } catch (error) {
      res.status(500).json({ message: "Xəta baş verdi", error: error.message });
    }
  },
};

module.exports = deliveryController;
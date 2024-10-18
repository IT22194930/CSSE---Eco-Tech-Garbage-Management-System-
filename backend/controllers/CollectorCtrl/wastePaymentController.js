// CollectorCtrl/wastePaymentController.js
const UserTransactionService = require("../../services/UserTransactionService");

class WastePaymentController {
  static instance;

  constructor() {
    if (WastePaymentController.instance) {
      throw new Error(
        "Cannot instantiate directly. Use WastePaymentController.getInstance() instead."
      );
    }
  }

  static getInstance() {
    if (!WastePaymentController.instance) {
      WastePaymentController.instance = new WastePaymentController();
    }
    return WastePaymentController.instance;
  }

  async addCashBack(req, res) {
    try {
      const { userId, amount } = req.body;
      const transactionType = "Cash Back"; // Hardcoded as Cash Back for this method

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const transactionService = UserTransactionService.getInstance(); // Get instance here

      await transactionService.updateAccountBalance(
        userId,
        amount * -1, // Subtracting the amount for cashback
        transactionType
      );
      return res.status(200).json("Account balance updated..");
    } catch (error) {
      console.error("Error in addCashBack:", error); // Log the error for debugging
      return res.status(500).json({ error: true, message: error.message });
    }
  }

  async addAdditionalPrice(req, res) {
    try {
      const { userId, amount } = req.body;
      const transactionType = "Special Waste Fee"; // Hardcoded as Additional Fee for this method

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const transactionService = UserTransactionService.getInstance(); // Get instance here

      await transactionService.updateAccountBalance(
        userId,
        amount * 1,
        transactionType
      );
      return res.status(200).json("Account balance updated..");
    } catch (error) {
      console.error("Error in addAdditionalPrice:", error); // Log the error for debugging
      return res.status(500).json({ error: true, message: error.message });
    }
  }
}

module.exports = WastePaymentController.getInstance();

const User = require("../../models/User/User");

class CashBackController {
  async getTotalDueAmount(req, res) {
    try {
      const userId = req.params.userId;
      console.log(req.params);
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ message: "Invalid USer ID." });
      }
      res.status(200).json({
        balance: user.balance,
        overdueStatus: user.balance > 10000,
      });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async processPayment(req, res) {
    const { userId, amount, storageCond, qualityStatus } = req.body;

    res.status(200).json({});
  }
}
module.exports = CashBackController.getInstance();

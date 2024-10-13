const User = require("../../models/User/User");
const TransactionDetail = require("../../models/User/TrasactionDetail");


class PaymentController {
    static instance;
    constructor() {
        if(PaymentController.instance) {
            throw new Error("Cannot instantiate directly. Use PaymentController.getInstance() instead.");
        }
    }

    static getInstance() {
        if (!PaymentController.instance) {
            PaymentController.instance = new PaymentController();
        }
        return PaymentController.instance;
    }

    async getTotalDueAmount (req, res) {
        try {
            const userId = req.params.userId;
            console.log(req.params);
            if (!userId) {
              return res.status(400).json({ message: "User ID is required" });
            }
            const user = await User.findById(userId);
            if (!user) {
              return res
                .status(401)
                .json({ message: "Invalid USer ID." });
            }
            res.status(200).json({
                balance: user.balance,
                overdueStatus: user.balance > 10000
            });
          } catch (error) {
            res.status(500).json({ error: true, message: error.message });
          }
    }

    async processPayment(req, res) {
        const { userId, amount, storageCond, qualityStatus } = req.body;

        
    }

}
module.exports = PaymentController.getInstance();
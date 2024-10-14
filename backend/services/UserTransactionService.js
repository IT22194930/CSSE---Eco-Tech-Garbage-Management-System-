const User = require("../models/User/User");
const TransactionLog = require("../models/User/TransactionLog");

class UserTransactionService {
    static instance;
    constructor() {
        if (UserTransactionService.instance) {
            throw new Error("Cannot instantiate directly. Use UserTransactionService.getInstance() instead.")
        }
    }

    static getInstance() {
        if (!UserTransactionService.instance) {
            UserTransactionService.instance = new UserTransactionService();
        }
        return UserTransactionService.instance;
    }

    async updateAccountBalance(customerId, amount, transactionType) {

        const user = await User.findById(customerId);

        if (!user) {
            throw new Error("Invalid User ID");
        }

        user.balance = (user.balance || 0) + amount;

        await user.save();

        // Create a transaction log after updating the balance
        const transactionLog = new TransactionLog({
            userId: user._id,
            amount: amount,
            transactionType: transactionType,
            date: new Date()
        });

        await transactionLog.save();

        console.log(`Updated balance for user ${user.name}: ${user.balance}`);
    }
}

module.exports = UserTransactionService;

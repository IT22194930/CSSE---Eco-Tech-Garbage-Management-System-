const User = require("../../models/User/User");
const TransactionLog = require("../../models/User/TransactionLog");
const PaymentGateway = require("../../services/PaymentGateway");
const UserTransactionService = require("../../services/UserTransactionService")

const paymentGateway = PaymentGateway.getInstance();
const transactionService = UserTransactionService.getInstance();

class PaymentController {
    static instance;

    constructor() {
        if (PaymentController.instance) {
            throw new Error("Cannot instantiate directly. Use PaymentController.getInstance() instead.");
        }
    }

    static getInstance() {
        if (!PaymentController.instance) {
            PaymentController.instance = new PaymentController();
        }
        return PaymentController.instance;
    }

    async getTotalDueAmount(req, res) {
        try {
            const userId = req.params.userId;
            console.log(req.params);
            if (!userId) {
                return res.status(400).json({message: "User ID is required"});
            }
            const user = await User.findById(userId);
            if (!user) {
                return res
                    .status(401)
                    .json({message: "Invalid USer ID."});
            }
            return res.status(200).json({
                balance: user.balance,
                isOverDue: user.balance > 6000
            });
        } catch (error) {
            return res.status(500).json({error: true, message: error.message});
        }
    }

    async getTransactionLog(req, res) {
        try {
            const userId = req.params.userId;
            console.log(req.params);
            if (!userId) {
                return res.status(400).json({message: "User ID is required"});
            }
            const transactionLogList = await TransactionLog.find({userId: userId});
            if (transactionLogList.length > 0) {
                return res
                    .status(200)
                    .json({transactionLog: transactionLogList});
            }
            return res.status(200).json({transactionLog: []});

        } catch (error) {
            return res.status(500).json({error: true, message: error.message});
        }
    }

    async updateUserAccountBalance(req, res) {
        try {
            const {userId, amount, transactionType} = req.body;
            if (!userId) {
                return res.status(400).json({message: "User ID is required"});
            }

            await transactionService.updateAccountBalance(userId, amount, transactionType);
            return res.status(200).json("Account balance updated..");
        } catch (error) {
            return res.status(500).json({error: true, message: error.message});
        }
    }

    async createPaymentIntent(req, res) {
        try {
            const {userId, amount, currency} = req.body;

            const clientSecret = await paymentGateway.createPaymentIntent(userId, amount, currency);

            return res.status(200).json({clientSecret: clientSecret});
        } catch (error) {
            console.error('Payment error:', error);
            return res.status(500).json({success: false, error: error.message});
        }
    }

    async confirmPayment(req, res) {
        try {
            const {userId, clientSecret, amount, cardNumber, cvv, expiryDate} = req.body;
            const isValidCardDetails = paymentGateway.validateCardDetails(cardNumber, expiryDate, cvv);
            if (!isValidCardDetails) {
                return res.status(400).json({success: false, message: "Invalid Card Details1"});
            }
            const result = paymentGateway.confirmPayment(clientSecret, isValidCardDetails);
            console.log(result);
            if (result === 'succeeded') {
                console.log("payment successful");
                await transactionService.updateAccountBalance(userId, amount * -1, 'Bill Payment');
                return res.status(200).json({success: true, message: "Payment Successful"});
            } else {
                return res.status(200).json({success: false, message: "Payment Method failed"});
                console.log("Payment Method failed1");
            }
        } catch (error) {
            console.error('Payment error:', error);
            return res.status(500).json({success: false, error: error.message});
        }
    }

}

module.exports = PaymentController.getInstance();

const express = require("express");
const router = express.Router();
const {
    getTotalDueAmount,
    createPaymentIntent,
    getTransactionLog,
    updateUserAccountBalance,
    confirmPayment,
    getAllTransactionLogs
} = require("../../controllers/Payment/paymentController");

router.get("/totalDueAmount/:userId", getTotalDueAmount);
router.get("/transactionLog/:userId", getTransactionLog);
router.post("/createPaymentIntent", createPaymentIntent);
router.post("/updateAccountBalance", updateUserAccountBalance);
router.post("/confirmPayment", confirmPayment);
// Route to get all transaction logs
router.get("/", getAllTransactionLogs);

module.exports = router;

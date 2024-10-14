
const express = require("express");
const router = express.Router();
const {
    getTotalDueAmount,
    createPaymentIntent,
    getTransactionLog,
    updateUserAccountBalance
} = require("../../controllers/Payment/paymentController");

router.get("/totalDueAmount/:userId", getTotalDueAmount);
router.get("/transactionLog/:userId", getTransactionLog);
router.post("/createPaymentIntent", createPaymentIntent);
router.post("/updateAccountBalance", updateUserAccountBalance);

module.exports = router;

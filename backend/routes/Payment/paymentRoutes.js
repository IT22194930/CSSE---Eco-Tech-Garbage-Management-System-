
const express = require("express");
const router = express.Router();
const {
    getTotalDueAmount,
    createPaymentIntent,
    getTransactionLog
} = require("../../controllers/Payment/paymentController");

router.get("/totalDueAmount/:userId", getTotalDueAmount);
router.get("/transactionLog/:userId", getTransactionLog);
router.post("/createPaymentIntent", createPaymentIntent);

module.exports = router;

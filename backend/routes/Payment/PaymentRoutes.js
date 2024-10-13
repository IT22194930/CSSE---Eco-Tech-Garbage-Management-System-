
const express = require("express");
const router = express.Router();
const {
    testRequest,
    getTotalDueAmount,
    processPayment
} = require("../../controllers/Payment/PaymentController");

router.get("/totalDueAmount/:userId", getTotalDueAmount);
router.post("/processPayment", processPayment);

module.exports = router;
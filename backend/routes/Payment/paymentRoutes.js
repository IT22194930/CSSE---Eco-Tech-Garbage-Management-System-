
const express = require("express");
const router = express.Router();
const {
    getTotalDueAmount,
    createPaymentIntent,
} = require("../../controllers/Payment/paymentController");

router.get("/totalDueAmount/:userId", getTotalDueAmount);
router.post("/createPaymentIntent", createPaymentIntent);

module.exports = router;

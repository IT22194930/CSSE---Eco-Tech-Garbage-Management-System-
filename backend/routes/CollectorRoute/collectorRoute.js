const express = require("express");
const router = express.Router();
const {
  addAdditionalPrice,
  addCashBack,
} = require("../../controllers/CollectorCtrl/wastePaymentController");

router.post("/addCashBack", addCashBack);
router.post("/addAdditionalPrice", addAdditionalPrice);

module.exports = router;

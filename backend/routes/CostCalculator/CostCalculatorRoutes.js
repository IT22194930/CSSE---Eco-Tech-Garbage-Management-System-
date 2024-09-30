const express = require('express');
const { calculateCost, previousCalculations } = require("../../controllers/CostCalculator/CostCalculatorController");

const router = express.Router();

router.post('/calculate', calculateCost);
router.get('/userCalculations', previousCalculations);

module.exports = router;
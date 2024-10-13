const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, default: 0.0 },
  cashback: { type: Number, default: 0.0 },
  specialCost: { type: Number, default: 0.0 },
  transactionType: { type: String },
  date: { type: Date, default: Date.now },
});

const TransactionDetail = mongoose.model(
  "TransactionDetail",
  transactionSchema
);

module.exports = TransactionDetail;

const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, default: 0.0 },
  transactionType: { type: String },
  date: { type: Date, default: Date.now },
});

const TransactionLog = mongoose.model(
  "TransactionLog",
  transactionLogSchema
);

module.exports = TransactionLog;

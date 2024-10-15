const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  topic: { type: String, required: true },

  message: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inquiry", inquirySchema);

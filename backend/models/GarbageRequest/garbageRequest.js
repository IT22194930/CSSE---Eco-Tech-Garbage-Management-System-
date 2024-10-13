// models/GarbageRequests/garbageRequest.js
const mongoose = require("mongoose");

const garbageRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String, // Type of garbage (e.g., bulk, e-waste, etc.)
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date, // Date of request (or when the garbage will be picked up)
    required: true,
  },
  time: {
    type: String, // Time of request (or when the garbage will be picked up)
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  recyclableQuantity: {
    type: Number,
    default: 0,
  },
  cashbackPrice: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  feedback: {
    type: String
  }
});

const GarbageRequest = mongoose.model("GarbageRequest", garbageRequestSchema);

module.exports = GarbageRequest;
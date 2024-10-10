// models/GarbageType/garbageType.js
const mongoose = require("mongoose");

const garbageTypeSchema = new mongoose.Schema({
  type: {
    type: String
  },
  unitPrice: {
    type: Number
  }
});

const GarbageType = mongoose.model("GarbageType", garbageTypeSchema);

module.exports = GarbageType;
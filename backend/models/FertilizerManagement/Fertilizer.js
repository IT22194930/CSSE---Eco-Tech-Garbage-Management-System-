const mongoose = require("mongoose");

const FertilizerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Fertilizer = mongoose.model("Fertilizer", FertilizerSchema);

module.exports = Fertilizer;

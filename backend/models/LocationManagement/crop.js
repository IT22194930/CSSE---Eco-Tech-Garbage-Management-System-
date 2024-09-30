const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
  },
  cropType: {
    type: String,
    required: true,
  },
  landSize: {
    type: String,
    required: true,
  },
  plantingQuantity: {
    type: String,
    required: true,
  },
  expectedQuantity: {
    type: String,
    required: true,
  },
  plantingDate: {
    type: String,
    required: true,
  },
  expectedDate: {
    type: String,
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
});

const Crop = mongoose.model("Crop", CropSchema);

module.exports = Crop;

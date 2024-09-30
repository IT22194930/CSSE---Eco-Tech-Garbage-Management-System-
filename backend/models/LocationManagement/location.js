const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  areaSize: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  irrigationType: {
    type: String,
    required: true,
  },
  crops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
    },
  ],
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;

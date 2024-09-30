const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  climate: {
    type: String,
  },
  soilPh: {
    type: String,
  },
  landPreparation: {
    type: String,
  },
  fertilizers: [
    {
      type: String,
    },
  ],
  diseases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
    },
  ],
});

module.exports = mongoose.model("Plant", PlantSchema);

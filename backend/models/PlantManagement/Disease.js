const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema({
  imageUrl: { type: String },
  name: {
    type: String,
    required: true,
  },
  causalAgent: {
    type: String,
    required: true,
  },
  diseaseTransmission: {
    type: String,
    required: true,
  },
  diseaseSymptoms: {
    type: String,
    required: true,
  },
  control: {
    type: String,
    required: true,
  },
  fertilizers: [
    {
      type: String,
      required: true,
    },
  ],
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
});

const Disease = mongoose.model("Disease", DiseaseSchema);

module.exports = Disease;

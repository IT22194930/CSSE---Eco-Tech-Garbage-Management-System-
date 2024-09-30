const Fertilizer = require("../../models/FertilizerManagement/Fertilizer");

const addFertilizer = async (req, res) => {
  const { imageUrl, productName, category, description, quantity, price } = req.body;
  try {
    const newFertilizer = await Fertilizer.create({
      imageUrl,
      productName,
      category,
      description,
      quantity,
      price,
    });
    res.json("New Fertilizer Added");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllFertilizers = async (req, res) => {
  try {
    const Fertilizers = await Fertilizer.find(); // Corrected to Fertilizer.find()
    res.json(Fertilizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOneFertilizer = async (req, res) => {
  const id = req.params.id;
  try {
    const Fertilizer = await Fertilizer.findById(id);
    res.status(200).json(Fertilizer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFertilizer = async (req, res) => {
  const id = req.params.id;
  try {
    await Fertilizer.findByIdAndDelete(id);
    res.status(200).json({ message: "Fertilizer Deleted" }); // Corrected message
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFertilizer = async (req, res) => {
  const id = req.params.id;
  const { imageUrl, productName, category, description, quantity, price } = req.body;
  try {
    await Fertilizer.findByIdAndUpdate(
      id,
      {
        imageUrl,
      productName,
      category,
      description,
      quantity,
      price,
      },
      { new: true }
    ); // Added { new: true } to return updated document
    res.status(200).json({ message: "Fertilizer Updated" }); // Corrected message
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addFertilizer,
  getAllFertilizers,
  getOneFertilizer,
  deleteFertilizer,
  updateFertilizer,
};

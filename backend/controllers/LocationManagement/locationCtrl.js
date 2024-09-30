const Location = require("../../models/LocationManagement/location");

const addLocation = async (req, res) => {
  const { province, district, city, latitude, longitude, areaSize, soilType, irrigationType } = req.body;
  try {
    const newLocation = await Location.create({
      province,
      district,
      city,
      latitude,
      longitude,
      areaSize,
      soilType,
      irrigationType,
    });
    res.json("New Location Added");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find(); // Corrected to Location.find()
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOneLocation = async (req, res) => {
  const id = req.params.id;
  try {
    const location = await Location.findById(id);
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLocation = async (req, res) => {
  const id = req.params.id;
  try {
    await Location.findByIdAndDelete(id);
    res.status(200).json({ message: "Location Deleted" }); // Corrected message
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLocation = async (req, res) => {
  const id = req.params.id;
  const { province, district, city, latitude, longitude, areaSize, soilType, irrigationType } = req.body;
  try {
    await Location.findByIdAndUpdate(
      id,
      {
        province,
        district,
        city,
        latitude,
        longitude,
        areaSize,
        soilType,
        irrigationType,
      },
      { new: true }
    ); // Added { new: true } to return updated document
    res.status(200).json({ message: "Location Updated" }); // Corrected message
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addLocation,
  getAllLocations,
  getOneLocation,
  deleteLocation,
  updateLocation,
};

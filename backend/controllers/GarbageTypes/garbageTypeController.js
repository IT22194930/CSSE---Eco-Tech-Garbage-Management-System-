const GarbageType = require("../../models/GarbageType/garbageType");

exports.getGarbageTypes = async (req, res) => {
   try {
     const garbageTypes = await GarbageType.find();
     res.json(garbageTypes);
   } catch (error) {
     res.status(500).json({ error: true, message: error.message });
   }
 };
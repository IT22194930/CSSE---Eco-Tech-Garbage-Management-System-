const express = require("express");
const router = express.Router();
const {
   getGarbageTypes
 } = require("../../controllers/GarbageTypes/garbageTypeController");

// Route to get all garbage types
router.get("/", getGarbageTypes);

module.exports = router;
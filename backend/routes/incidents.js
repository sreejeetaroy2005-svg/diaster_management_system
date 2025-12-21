const express = require("express");
const router = express.Router();
const multer = require("multer");
const Incident = require("../models/models");

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST /api/incidents
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { incident_type, description, state, city, area, location } = req.body;
    if (!incident_type || !description || !state || !city || !area || !location) {
      return res.status(400).json({ message: "All fields except image are required." });
    }

    const newIncident = new Incident({
      incident_type,
      description,
      state,
      city,
      area,
      location,
      image: req.file ? req.file.filename : null
    });

    await newIncident.save();
    res.status(201).json({ message: "Incident reported successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
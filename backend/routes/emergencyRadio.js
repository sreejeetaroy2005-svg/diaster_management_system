const express = require("express");
const router = express.Router();
const EmergencyRadio = require("../models/EmergencyRadio");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "audio"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = [".mp3", ".wav", ".m4a"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files allowed"));
    }
  }
});
router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    const radio = new EmergencyRadio({
      title,
      message,
      priority,
      isActive: true,
      audioUrl: `http://localhost:5000/audio/${req.file.filename}`
    });

    await radio.save();
    res.json({ message: "Uploaded successfully", radio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/live", async (req, res) => {
  try {
    const radio = await EmergencyRadio.findOne({ isActive: true })
      .sort({ priority: -1, createdAt: -1 });

    res.json(radio || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

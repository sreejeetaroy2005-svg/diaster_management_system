const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "User already registered" });
    }

    await User.create({ name, email, phone });

    res.json({ success: true });

  } catch (err) {
    console.error("User register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

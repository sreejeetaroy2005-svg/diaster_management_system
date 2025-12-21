const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.json({ message: "Admin route working" });
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  console.log("ADMIN LOGIN HIT");

  try {
    const { username, password } = req.body;
    console.log("BODY:", req.body);

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ⚠️ Plain password check (for now)
    if (admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

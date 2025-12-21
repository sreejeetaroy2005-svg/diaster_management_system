

const express = require("express");
const router = express.Router();

const User = require("../models/users");
const SendAlert = require("../models/sendalert");
router.get("/test", (req, res) => {
  res.send("SendAlert route is working");
});

// POST → /api/sendalert/send
router.post("/send", async (req, res) => {
  try {
    // ✅ Debug: confirm body is coming
    console.log("REQ BODY:", req.body);

    const { location, disaster, message } = req.body;

    if (!location || !disaster || !message) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // 1️⃣ Save alert to DB
    const alert = new SendAlert({
      location,
      disaster,
      message
    });

    await alert.save();

    // 2️⃣ Fetch registered users
    const users = await User.find();

    console.log("TOTAL USERS FOUND:", users.length);

    if (users.length === 0) {
      return res.json({
        message: "Alert saved, but no registered users found"
      });
    }

    // 3️⃣ Collect contacts
    const emails = users.map(user => user.email);
    const phones = users.map(user => user.phone);

    console.log("📢 ALERT BROADCAST");
    console.log("Emails:", emails);
    console.log("Phones:", phones);

    // 4️⃣ Success response
    return res.json({
      message: "Alert sent successfully",
      totalUsers: users.length
    });

  } catch (err) {
    console.error("🔥 SEND ALERT ERROR 🔥");
    console.error(err);
    console.error(err.message);

    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
});

module.exports = router;


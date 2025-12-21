const mongoose = require("mongoose");

const sendAlertSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  disaster: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SendAlert", sendAlertSchema);

const mongoose = require("mongoose");

const radioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  audioUrl: {
    type: String,   // mp3 / wav file
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model("EmergencyRadio", radioSchema);

const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  incident_type: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String } // store filename
}, { timestamps: true });

module.exports = mongoose.model("Incident", incidentSchema);


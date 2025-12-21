require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const weatherRouter = require("./routes/weather");
const placesRoute = require("./routes/places");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/weather", weatherRouter);
app.use("/api/places", require("./routes/places"));



// Test route ✅
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
const incidentRoutes = require("./routes/incidents");
app.use("/api/incidents", incidentRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

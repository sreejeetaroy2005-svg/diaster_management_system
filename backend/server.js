require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const weatherRouter = require("./routes/weather");
const placesRoute = require("./routes/places");
const weather2Routes=require("./routes/weather2");
const userRoutes = require("./routes/users");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/weather", weatherRouter);
app.use("/api/places", require("./routes/places"));
app.use("/api/weather2", weather2Routes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/sendalert", require("./routes/sendalertroute"));


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

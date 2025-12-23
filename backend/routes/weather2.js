const express = require("express");
const router = express.Router();

const API_KEY = process.env.WEATHER_API_KEY;

// GET weather by lat & lon
router.get("/", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Weather API failed" });
    }

    
    const weather = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
      visibility: data.visibility
        ? `${data.visibility / 1000} km`
        : "N/A",
      alerts: data.weather[0].main
    };

    res.json(weather);

  } catch (err) {
    console.error("Weather backend error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

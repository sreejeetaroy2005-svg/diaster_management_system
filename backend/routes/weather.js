const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) return res.status(400).json({ error: "lat and lon required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({
      weather: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
      wind: data.wind.speed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

module.exports = router;

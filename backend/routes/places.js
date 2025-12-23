const express = require("express");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat & lon required" });
    }

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:5000,${lat},${lon});
        node["amenity"="police"](around:5000,${lat},${lon});
        node["amenity"="fire_station"](around:5000,${lat},${lon});
        node["amenity"="shelter"](around:5000,${lat},${lon});
      );
      out body;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data=${encodeURIComponent(query)}`
      }
    );

    const text = await response.text();

    if (!response.ok || text.startsWith("<")) {
      console.error("Overpass RAW RESPONSE:", text.slice(0, 300));
      return res.status(502).json({ error: "Overpass API error" });
    }

    const data = JSON.parse(text);

    const places = data.elements.map(el => ({
      name: el.tags?.name || "Unnamed",
      type: el.tags?.amenity || "unknown",
      lat: el.lat,
      lon: el.lon
    }));

    res.json(places);

  } catch (err) {
    console.error("Overpass API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

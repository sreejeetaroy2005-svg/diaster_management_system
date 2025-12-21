const express = require("express");
const router = express.Router();

/*
  GET /api/places/nearby?lat=..&lon=..
*/
router.get("/nearby", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  // Overpass API query
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${lat},${lon});
      node["amenity"="police"](around:5000,${lat},${lon});
      node["amenity"="fire_station"](around:5000,${lat},${lon});
      node["amenity"="shelter"](around:5000,${lat},${lon});
    );
    out body;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      }
    );

    const data = await response.json();

    const places = data.elements.map(el => ({
      name: el.tags?.name || "Unnamed Facility",
      type: el.tags?.amenity || "unknown",
      lat: el.lat,
      lon: el.lon,
    }));

    res.json(places);

  } catch (err) {
    console.error("Overpass API error:", err);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

module.exports = router;

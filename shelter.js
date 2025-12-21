const list = document.getElementById("list");
let map;

/* ---------- Utility message ---------- */
function showMessage(msg) {
  list.innerHTML = `<div class="status">${msg}</div>`;
}

/* ---------- INIT MAP ---------- */
document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([22.5726, 88.3639], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  locateUser();
});

/* ---------- GEOLOCATION ---------- */
function locateUser() {
  if (!navigator.geolocation) {
    loadPlaces(22.5726, 88.3639);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;

      map.setView([latitude, longitude], 14);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();

      loadPlaces(latitude, longitude);
    },
    () => {
      showMessage("Location denied. Using fallback.");
      loadPlaces(22.5726, 88.3639);
    }
  );
}

/* ---------- FETCH PLACES ---------- */
async function loadPlaces(lat, lon) {
  showMessage("Finding nearby emergency services...");

  try {
    const res = await fetch(
      `http://localhost:5000/api/places/nearby?lat=${lat}&lon=${lon}`
    );

    const places = await res.json();

    if (!Array.isArray(places) || places.length === 0) {
      showMessage("No emergency services found nearby.");
      return;
    }

    list.innerHTML = "";

    places.forEach(p => {
      const plat = parseFloat(p.lat);
      const plon = parseFloat(p.lon);

      let marker = null;

      /* ---------- MAP MARKER ---------- */
      if (!isNaN(plat) && !isNaN(plon)) {
        marker = L.marker([plat, plon])
          .addTo(map)
          .bindPopup(`
            <strong>${p.name}</strong><br/>
            <small>${p.type.toUpperCase()}</small>
          `);
      }

      /* ---------- LIST ITEM ---------- */
      const div = document.createElement("div");
      div.className = `shelter type-${p.type}`;
      div.innerHTML = `
        <strong>${p.name}</strong>
        <div class="meta">
          <span>${p.type.toUpperCase()}</span>
          <span>${plat.toFixed(3)}, ${plon.toFixed(3)}</span>
        </div>
      `;

      /* ---------- CLICK → MAP ---------- */
      div.addEventListener("click", () => {
        if (marker) {
          map.setView([plat, plon], 16, { animate: true });
          marker.openPopup();
        }
      });

      list.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    showMessage("Backend not reachable.");
  }
}


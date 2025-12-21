const alertBar = document.getElementById("alertBar");
const alertType = document.getElementById("alertType");
const alertSeverity = document.getElementById("alertSeverity");
const alertMessage = document.getElementById("alertMessage");
const alertTime = document.getElementById("alertTime");
const alertLocation = document.getElementById("alertLocation");

// Main function
async function updateWeatherAlert(lat, lon) {
  try {
    const res = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    let type = data.weather;
    let severity = "Moderate";
    let message = `Weather: ${data.description}, Temp: ${data.temp}°C`;

    if (type === "Rain" || type === "Thunderstorm") {
      severity = "Severe";
      alertBar.classList.add("severe");
    } else {
      alertBar.classList.remove("severe");
    }

    alertType.textContent = type;
    alertSeverity.textContent = severity;
    alertMessage.textContent = message;
    alertTime.textContent = new Date().toLocaleTimeString();
    alertLocation.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    alertBar.classList.remove("hidden");

  } catch (err) {
    console.error(err);
    alertBar.classList.remove("hidden");
    alertType.textContent = "Error";
    alertSeverity.textContent = "N/A";
    alertMessage.textContent = "Unable to fetch weather alerts.";
    alertTime.textContent = new Date().toLocaleTimeString();
    alertLocation.textContent = "";
  }
}

// Geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // First fetch with live coordinates
      updateWeatherAlert(lat, lon);

      // Keep fetching every 5 minutes with the same coordinates
      setInterval(() => updateWeatherAlert(lat, lon), 5 * 60 * 1000);
    },
    err => {
      console.warn("Location denied, using default coordinates");
      const lat = 12.34;
      const lon = 56.78;
      updateWeatherAlert(lat, lon);
    }
  );
} else {
  console.warn("Geolocation not supported, using default coordinates");
  const lat = 12.34;
  const lon = 56.78;
  updateWeatherAlert(lat, lon);
}

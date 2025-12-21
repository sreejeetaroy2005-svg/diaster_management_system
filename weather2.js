async function loadWeather(lat, lon) {
  const res = await fetch(
    `http://localhost:5000/api/weather2?lat=${lat}&lon=${lon}`
  );

  const w = await res.json();

  document.querySelector(".temp").innerText = `${w.temp}°C`;
  document.querySelector(".condition").innerText = w.condition;

  document.querySelector(".weather-details").innerHTML = `
    <div><strong>Humidity:</strong> ${w.humidity}%</div>
    <div><strong>Wind:</strong> ${w.wind} km/h</div>
    <div><strong>Visibility:</strong> ${w.visibility}</div>
    <div><strong>Alert:</strong> ${w.alert}</div>
  `;
}

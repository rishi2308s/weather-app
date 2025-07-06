const apiKey = "11b867b6a8f6483a8ad153716250607";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const recentDropdown = document.getElementById("recentDropdown");
const recentSearches = document.getElementById("recentSearches");
const errorMessage = document.getElementById("errorMessage");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  clearError();
  fetchWeather(city);
  saveCity(city);
});

recentDropdown.addEventListener("change", () => {
  const city = recentDropdown.value;
  if (city) {
    clearError();
    fetchWeather(city);
  }
});

currentLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  clearError();
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`${latitude},${longitude}`);
    },
    () => showError("Unable to retrieve your location.")
  );
});

function fetchWeather(query) {
  weatherDisplay.innerHTML = `<p class="italic text-center">Loading weather data for <strong>${query}</strong>...</p>`;

  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&days=5&aqi=no&alerts=no`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error.message);
      renderWeather(data);
    })
    .catch((err) => {
      showError(err.message);
      weatherDisplay.innerHTML = "";
    });
}

function renderWeather(data) {
  const { location, current, forecast } = data;

  const forecastHTML = forecast.forecastday
    .map(
      (day) => `
    <div class="p-3 bg-blue-50 rounded shadow space-y-1 text-center">
      <p class="font-semibold">${day.date}</p>
      <img
        src="${day.day.condition.icon}"
        alt="${day.day.condition.text}"
        class="mx-auto"
      />
      <p>${day.day.avgtemp_c}°C</p>
      <p>💨 ${day.day.maxwind_kph} kph</p>
      <p>💧 ${day.day.avghumidity}%</p>
    </div>`
    )
    .join("");

  weatherDisplay.innerHTML = `
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold">${location.name}, ${location.country}</h2>
      <img
        src="${current.condition.icon}"
        alt="${current.condition.text}"
        class="mx-auto"
      />
      <p class="text-xl">${current.temp_c}°C | ${current.condition.text}</p>
      <p>Humidity: ${current.humidity}% | Wind: ${current.wind_kph} kph</p>
    </div>
    <div
      class="mt-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4"
      aria-label="5-day weather forecast"
    >
      ${forecastHTML}
    </div>
  `;
}

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  cities = [city, ...cities.filter((c) => c !== city)].slice(0, 5);
  localStorage.setItem("recentCities", JSON.stringify(cities));
  updateRecentDropdown(cities);
}

function updateRecentDropdown(cities) {
  if (cities.length === 0) {
    recentSearches.classList.add("hidden");
    return;
  }
  recentDropdown.innerHTML = cities
    .map((city) => `<option value="${city}">${city}</option>`)
    .join("");
  recentSearches.classList.remove("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

// On page load, populate recent cities dropdown
window.addEventListener("load", () => {
  const savedCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  updateRecentDropdown(savedCities);
});

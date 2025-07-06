const apiKey = "11b867b6a8f6483a8ad153716250607";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const recentDropdown = document.getElementById("recentDropdown");
const recentSearches = document.getElementById("recentSearches");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("spinner");

let isLoading = false;

// Toggle loading state: show spinner, disable inputs/buttons
function setLoading(loading) {
  isLoading = loading;
  spinner.classList.toggle("hidden", !loading);
  searchBtn.disabled = loading;
  currentLocationBtn.disabled = loading;
  cityInput.disabled = loading;
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
}

// Clear error message
function clearError() {
  errorMessage.textContent = "";
}

// Fetch weather data from API
async function fetchWeather(query) {
  weatherDisplay.innerHTML = ""; // Clear old data
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
        query
      )}&days=5&aqi=no&alerts=no`
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    renderWeather(data);
    saveCity(data.location.name);
  } catch (err) {
    showError(err.message);
  }
}

// Render weather info on the page
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

// Save city in localStorage and update recent dropdown
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  cities = [city, ...cities.filter((c) => c !== city)].slice(0, 5);
  localStorage.setItem("recentCities", JSON.stringify(cities));
  updateRecentDropdown(cities);
}

// Update recent cities dropdown UI
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

// Event Listeners

searchBtn.addEventListener("click", () => {
  if (isLoading) return; // prevent multiple fetches
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  clearError();
  setLoading(true);
  fetchWeather(city).finally(() => setLoading(false));
});

recentDropdown.addEventListener("change", () => {
  if (isLoading) return;
  const city = recentDropdown.value;
  if (city) {
    clearError();
    setLoading(true);
    fetchWeather(city).finally(() => setLoading(false));
  }
});

currentLocationBtn.addEventListener("click", () => {
  if (isLoading) return;
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  clearError();
  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`${latitude},${longitude}`).finally(() => setLoading(false));
    },
    () => {
      showError("Unable to retrieve your location.");
      setLoading(false);
    }
  );
});

// Initialize recent searches dropdown on page load
window.addEventListener("load", () => {
  const savedCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  updateRecentDropdown(savedCities);
  clearError();
});

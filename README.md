# Weather Forecast App ☁️🌦️

A responsive and intuitive weather forecast application built using **JavaScript, HTML, and Tailwind CSS (via CDN for quick setup and fast styling without build tools)**. The app integrates with the [WeatherAPI](https://www.weatherapi.com/) to provide real-time and extended weather forecasts.

## Features:
- 🔍 Search weather by **city name**
- 📍 Get weather for **current location** using Geolocation API
- 🔄 View **5-day forecast** with temperature, wind speed, humidity & condition icons
- ⏱️ **Loading spinner** for better UX during API calls
- ❗ Graceful error handling for API failures, invalid cities, or no internet
- 📌 **Recent searches dropdown** stored in localStorage
- 📱 Fully **responsive UI** for Desktop, iPad Mini, and iPhone SE
- ✅ Tailwind CDN is used for styling — enabling fast, utility-first design without any build setup

## Setup Instructions:
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/weather-app.git

2. Open the project folder:
   ```bash
   cd weather-app

3. Start a simple server (e.g., with Python):
   ```bash
   python -m http.server 8000

Open your browser and go to: http://localhost:8000

🔑 API Key
Replace the placeholder API key in script.js with your own from WeatherAPI.

4. Check the functionality and make any changes as per your wishes.
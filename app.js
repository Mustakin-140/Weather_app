const apiKey = 'c5665ef98d4e4d5386994352242209'; 
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const forecastResult = document.getElementById('forecast-result');

//loading
searchBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    weatherResult.innerHTML = '';
    forecastResult.innerHTML = '';
    document.getElementById('loading').style.display = 'block'; 

    fetchWeatherData(city).finally(() => {
      document.getElementById('loading').style.display = 'none'; 
    });
  } else {
    weatherResult.innerHTML = '<p class="error-message">Please enter a city name.</p>';
  }
});

// Event listener for search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    // Clear previous weather and forecast data
    weatherResult.innerHTML = '';
    forecastResult.innerHTML = '';
    
    // Fetch the new city's weather data
    fetchWeatherData(city);
  } else {
    weatherResult.innerHTML = '<p class="error-message">Please enter a city name.</p>';
  }
});

// Fetch current weather data from API
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayWeatherData(data);
    fetchForecastData(city);
  } catch (error) {
    weatherResult.innerHTML = `<p class="error-message">${error.message}</p>`;
    forecastResult.innerHTML = ''; 
  }
}

// Fetch 3-day forecast data from API
async function fetchForecastData(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`);
    const data = await response.json();
    displayForecastData(data.forecast.forecastday);
  } catch (error) {
    forecastResult.innerHTML = `<p class="error-message">Unable to fetch forecast data.</p>`;
  }
}

// Display current weather data
function displayWeatherData(data) {
  weatherResult.innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
    <p><strong>Condition:</strong> ${data.current.condition.text}</p>
    <img src="${data.current.condition.icon}" alt="Weather icon">
  `;
}

// Display 3-day forecast data
function displayForecastData(forecast) {
  forecastResult.innerHTML = '<h3 class="heading">3-Day Forecast</h3>';
  
  forecast.forEach(day => {
    const forecastHTML = `
      <div class="forecast-day">
        <p><strong>${day.date}</strong></p>
        <p><strong>Max Temp:</strong> ${day.day.maxtemp_c}°C</p>
        <p><strong>Min Temp:</strong> ${day.day.mintemp_c}°C</p>
        <p><strong>Condition:</strong> ${day.day.condition.text}</p>
        <img src="${day.day.condition.icon}" alt="Weather icon">
      </div>
    `;
    forecastResult.innerHTML += forecastHTML;
  });
}


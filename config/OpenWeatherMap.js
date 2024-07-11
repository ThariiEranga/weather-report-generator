const axios = require('axios');
const { openWeatherMapApiKey } = require('./API-config.js');

async function getWeather(city) {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data: ${error}`);
    throw new Error(`Failed to fetch weather data for ${city}`);
  }
}

module.exports = { getWeather };

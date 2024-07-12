const { GoogleGenerativeAI } = require("@google/generative-ai");
const {geminiAiApiKey} = require("./API-config")
const genAI = new GoogleGenerativeAI(geminiAiApiKey);

function extractWeatherData(weatherData) {
  const {
    name: cityName,
    main: { temp, feels_like, pressure, humidity },
    wind: { speed: windSpeed },
    sys: { country },
  } = weatherData;

  return { cityName, temp, feels_like, pressure, humidity, windSpeed, country };
}

async function run(weatherData) {
  const extractedData = extractWeatherData(weatherData);

  const prompt = `Give me small weather report descriptiion using ${extractedData.cityName}, ${extractedData.country}: 
  - Temperature: ${extractedData.temp} degrees
  - Feels like: ${extractedData.feels_like} degrees
  - Humidity: ${extractedData.humidity}%
  - Wind speed: ${extractedData.windSpeed} mph
  - Pressure: ${extractedData.pressure}.`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text
}

module.exports = {run};
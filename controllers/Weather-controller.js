const weatherSchema = require("../models/weather")
const userSchema = require("../models/User")
const express = require("express")
const cron = require('node-cron');
// const { weatherData } = require('../config/OpenWeatherMap');

// cron.schedule('0 */3 * * *', async () => {
//     const users = await userSchema.find();
//     users.forEach(async (user) => {
//         const WeatherData = await weatherData(user.location);
//         const weather = new weatherSchema({ userID: user._id,location:user.location, date: new Date(), WeatherData });
//         await weather.save();
//     });
// });

exports.addweather = async (req, res) => {
    try {
        const { userID,location,date,weather } = req.body;
    
        if ( !userID || !location || !date || !weather) {
          return res.status(400).json({ error: "All fields are required" });
        }

        const newweather = new weatherSchema({
          userID: userID,
          location: location,
          date: date.split('T')[0],
          time: new Date().toLocaleTimeString(),
          weather: weather,
        });
    
        await newweather.save();
        console.log(newweather);
        res.json({ message: "weather added", weather: newweather });
      } catch (err) {
        console.error("Error occurred while adding weather:", err);
        res.status(500).json({ error: "An error occurred while adding weather" });
      }
    };

    exports.getweatherbydate = async (req, res) => {
     
  try{
    const userID= req.params.id;
    const { date } = req.body; 
    const weather = await weatherSchema.find({ userID: userID, date: date });
    if(!weather) {
        throw new Error("Weather not found");
    }
     res.status(200).json(weather);
    }catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(error.code || 500).json({error: error.message});
    }
}

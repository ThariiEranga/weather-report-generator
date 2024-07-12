const weatherSchema = require("../models/weather")
const userSchema = require("../models/User")
const express = require("express")

exports.addweather = async (req, res) => {
    try {
        const { userID,location,date, Time ,weather } = req.body;
      const time = new Date().toLocaleTimeString() || Time
        if ( !userID || !location || !date || !weather) {
          return res.status(400).json({ error: "All fields are required" });
        }

        const newweather = new weatherSchema({
          userID: userID,
          location: location,
          date: date.split('T')[0],
          time: time,
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

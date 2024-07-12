const cron = require("node-cron");
const userSchema = require("../models/User");
const weatherSchema = require("../models/weather");
const { getWeather } = require("../config/OpenWeatherMap");
const { sendMail } = require("../config/Nodemailer");
const axios = require("axios");

cron.schedule("0 */3 * * *", async () => {
  try {
    const users = await userSchema.find();

    for (const user of users) {
      const weatherData = await getWeather(user.location);
      
      const emailData = {
        to: user.email,
        weatherData: weatherData,
      };

      const response = await axios.post(
        "http://localhost:3000/weather/sendmail",
        emailData
      );
      console.log(response.data);

      const currentDate = new Date().toISOString().split("T")[0];
      const time = new Date().toLocaleTimeString();

      const newWeather = new weatherSchema({
        userID: user._id,
        location: user.location,
        date: currentDate,
        time: time,
        weather: weatherData,
      });

      await newWeather.save();
      console.log(newWeather);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

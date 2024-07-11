const userSchema = require("../models/User");
const weatherSchema = require("../models/weather");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getCityFromCoordinates } = require("../config/googlecloud");
const { getWeather } = require("../config/OpenWeatherMap");
const axios = require("axios");

exports.registation = async (req, res, next) => {
  try {
    const { email, password, repassword, latitude, longitude } = req.body;

    if (!email || !password || !repassword || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const lat = latitude;
    const long = longitude;

    const location = await getCityFromCoordinates(lat, long);
    console.log(location);

    const weather = await getWeather(location);
    console.log(weather);

    if (password !== repassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    let existingCustomer;
    try {
      existingCustomer = await userSchema.findOne({ email: email });
      if (existingCustomer) {
        return res.status(400).json({ error: "This Email is already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newuser = new userSchema({
        email: email,
        password: hashedPassword,
        location: location,
      });

      await newuser.save();
      console.log(newuser);
      const currentDate = new Date().toISOString().split("T")[0];
      const newweather = new weatherSchema({
        userID: newuser.id,
        location: location,
        date: currentDate,
        weather: weather,
      });

      await newweather.save();
      console.log(newweather);

      // Respond with success message
      res
        .status(201)
        .json({ message: "User registered successfully", user: newuser });
    } catch (err) {
      console.error("Error occurred while user registration:", err);
      res.status(500).json({ error: "Error occurred while user registration" });
    }
  } catch (err) {
    console.error("Error occurred in registration handler:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await userSchema.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, could not log you in." });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, could not log you in." });
    }
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return res
      .status(500)
      .json({ message: "Could not log you in, please try again." });
  }

  const weather = await getWeather(existingUser.location);
  console.log(weather);

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET || "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error("Error generating token:", err);
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const newweather = new weatherSchema({
    userID: existingUser.id,
    location: existingUser.location,
    date: currentDate,
    weather: weather,
  });

  await newweather.save();
  console.log(newweather);

  return res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    message: "Logged in!",
  });
};

exports.uplocation = async (req, res) => {
  try {
    const userID = req.params.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const lat = latitude;
    const long = longitude;
    console.log(lat, long);
    const location = await getCityFromCoordinates(lat, long);

    const weather = await getWeather(location);
    console.log(weather);

    const updateduser = await userSchema.findByIdAndUpdate(
      userID,
      { location: location },
      { new: true }
    );

    const currentDate = new Date().toISOString().split("T")[0];
      const newweather = new weatherSchema({
        userID: userID,
        location: location,
        date: currentDate,
        weather: weather,
      });

      await newweather.save();
      console.log(newweather);

    if (!updateduser) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json({ status: "location updated", user: updateduser });
  } catch (err) {
    console.error("Error occurred while updating location:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating location" });
  }
};

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cornservice = require("./controllers/Weather-controller")
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/user", require("./routes/user-routes"));
app.use("/weather", require("./routes/weather-routes"))

const URL = process.env.URL;
mongoose.connect(URL).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
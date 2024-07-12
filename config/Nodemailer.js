const nodemailer = require("nodemailer");
const {run} = require("./GeminiAI")
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass:process.env.PASSWORD
  },
  
});

exports.sendMail = async (req, res) => {
  const { to,weatherData  } = req.body;

  const weather = await run(weatherData);
  console.log(weather);

  try {
    const mailOptions = {
      from: {
        name: 'Weather Reporter',
        address: process.env.EMAIL
      },
      to,
      subject: 'Hourly Weather Report',
      text: `Current weather: ${weather}`,
    
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error });
  }
}


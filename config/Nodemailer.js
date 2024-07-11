const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass:process.env.PASSWORD
  },
  
});

exports.sendMail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const mailOptions = {
      from: {
        name: 'Weather generator',
        address: process.env.EMAIL
      },
      to,
      subject,
      text
    
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error });
  }
}


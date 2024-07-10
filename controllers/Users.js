const userSchema = require("../models/User");
const express = require("express");
const bcrypt = require('bcryptjs');

exports.registation = async (req,res, next) =>{
    try {
        const {email, password, repassword, location } = req.body;

        if (!email || !password || !repassword || !location) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== repassword) {
            return res.status(400).json({ error: "Passwords do not match" });
          }
      
        let existingCustomer;
        try{
            existingCustomer = await userSchema.findOne({ email:email });
        } catch (err) {
          res.json("Customer Registration Fails.Try Again");
            return next(err);  
        }
        if (existingCustomer) {
          res.json("This Email is alredy in use.");
              return next(err);  
          }
        
          let hashedPassword;
          try {
            hashedPassword = await bcrypt.hash(password, 12);
          } catch (err) {
            res.json('Could not create user, please try again.');
            return next(err);
          }
        
        const newuser = new userSchema({
            email: email ,
            password : hashedPassword,
            location : location
        });
    
        await newuser.save();
        console.log(newuser);
        res.json({ message: "user added", user: newuser });
      } catch (err) {
        res.json("Error occurred while user registation");
      }
    };

    exports.login = async (req, res, next) => {
      const { email, password } = req.body;
    
      let existingUser;
    
      try {
        existingUser = await userSchema.findOne({ email: email });
        console.log(existingUser);
      } catch (err) {
        res.status(500).json({ message: 'Logging in failed, please try again later.' });
        return next(err);
      }
    
      if (!existingUser) {
        return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
      }
    
      let isMatch;
      try {
        isMatch = await bcrypt.compare(password, existingUser.password);
      } catch (err) {
        res.status(500).json({ message: 'Could not log you in, please try again.' });
        return next(err);
      }
    
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
      }
    
      return res.status(200).json({ message: 'Logged in!', user: existingUser });
    };
    
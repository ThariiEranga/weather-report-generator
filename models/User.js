const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({

    email:{
        type:String,
        required:true
        
    },
    password:{
        type:String,
        required:true
    },
    location:[{
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
      }  
    }],
    weather_Data:[{
        date:{
            type:Date,
            default:"not assigned"
        },
        weather:{
            type:String,
            default:"not assigned"
        }
    }],
});

const User = mongoose.model("User",userSchema);
module.exports = User;
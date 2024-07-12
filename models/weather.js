const mongoose = require("mongoose");

const schema = mongoose.Schema;

const weatherSchema = new schema({

   userID:{
        type:String,
        required:true
        
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    weather:{
        type:Object,
        required:true
    }
});

const weather = mongoose.model("Weather",weatherSchema);
module.exports = weather;
const{addweather,getweatherbydate} = require("../controllers/Weather-controller")
const{sendMail} = require("../config/Nodemailer")
const router = require("express").Router();


router.post("/addweather", addweather)
router.get("/getweather/:id",getweatherbydate)

router.post("/sendmail", sendMail)

module.exports = router;
const{addweather,getweatherbydate} = require("../controllers/Weather-controller")
const{sendMail} = require("../config/Nodemailer")
const router = require("express").Router();
const checkAuth = require("../controllers/middleware/Check-auth")

router.post("/addweather", addweather)
router.post("/sendmail", sendMail)
router.use(checkAuth);
router.get("/getweather/:id",getweatherbydate)

module.exports = router;
const{registation, login} = require("../controllers/Users")
const router = require("express").Router();


router.post("/adduser", registation)
router.post("/login",login)

module.exports = router;
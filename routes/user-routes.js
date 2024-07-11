const{registation, login, uplocation} = require("../controllers/Users")
const router = require("express").Router();


router.post("/adduser", registation)
router.post("/login",login)
router.put("/updatelocation/:id",uplocation)

module.exports = router;
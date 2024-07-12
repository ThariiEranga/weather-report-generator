const{registation, login, uplocation} = require("../controllers/Users")
const router = require("express").Router();
const checkAuth = require("../controllers/middleware/Check-auth")


router.post("/adduser", registation)
router.post("/login",login)
router.use(checkAuth);
router.put("/updatelocation/:id",uplocation)

module.exports = router;
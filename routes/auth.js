const express = require("express");

const router = express.Router();

const {signUp, signIn} = require("../controllers/auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/signup", signUp);
router.post("/signin", signIn);

//protected routes
router.get('/students', auth, isStudent, (req, res) => {
    res.status(200).json({
        success: true,
        messsage :" Successfully accessed the STUDENT protected route."
    })
})

router.get('/admin', auth, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        messsage :" Successfully accessed the ADMIN protected route."
    })
})

module.exports = router;
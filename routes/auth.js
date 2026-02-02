const express = require("express")
const router = express.Router()
const firebaseAuth = require("../middlewares/firebaseAuth")
const { syncUser } = require("../controllers/authController")

router.post("/sync", firebaseAuth, syncUser)

module.exports = router

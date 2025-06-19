const express = require("express")
const router = express.Router()
const {updateUser, getUser, deleteUser} = require("../controllers/profileController")

router.get("/profile", getUser)
router.put("/profile", updateUser)
router.delete("/profile", deleteUser)

module.exports = router

const express = require("express")
const router = express.Router()
const {updateUser, getUser, deleteUser} = require("../controllers/profileController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/profile", authMiddleware, getUser)
router.put("/profile", authMiddleware, updateUser)
router.delete("/profile", authMiddleware, deleteUser)

module.exports = router

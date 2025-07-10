const express = require("express")
const router = express.Router()
const {getCurations, createCurations, updateCuration, getCurationById} = require("../controllers/curationController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/curation", authMiddleware, getCurations)
router.post("/curation", authMiddleware, createCurations)
router.put("/curation/:id", authMiddleware, updateCuration)
router.get("/curation/:id", authMiddleware, getCurationById)



module.exports = router


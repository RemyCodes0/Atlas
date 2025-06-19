const getMessages = require("../controllers/messageController")
const express = require("express")
const router = express.Router()

router.get("/:chamber", getMessages)

module.exports =router
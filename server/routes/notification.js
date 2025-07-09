const express = require('express')
const router = express.Router()
const multer = require("multer")
const nodemailer = require("nodemailer")

const {getNotifications, createNotification, deleteNotification} = require("../controllers/NotificationController")
const authMiddleware = require("../middleware/authMiddleware")




const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, "uploads/");
    },
    filename: function(req, file, cb){
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})



router.get("/", authMiddleware, getNotifications)
router.post("/", authMiddleware, upload.single("image"), createNotification)
router.delete("/:id", authMiddleware, deleteNotification)



module.exports = router;
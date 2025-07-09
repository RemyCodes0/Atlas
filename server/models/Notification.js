const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Notification", notificationSchema)
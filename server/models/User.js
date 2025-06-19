const mongoose = require("mongoose")

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required:[true, "Please enter your password"],
    },
    role:{
        type: String,
        enum: ["CEO",  "President-I", "President-II","President-III","Vice President-I","Vice President-II","Vice President-III", "Member-I", "Member-II", "Member-III", "Peasant"],
        default:"Peasant"
    },
},
{timestamps: true}
)

module.exports = mongoose.model("User", userScheme);
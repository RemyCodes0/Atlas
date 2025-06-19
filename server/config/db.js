const mongoose = require("mongoose")

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo server is running 👍",)
    }catch(err){
        console.error("Mongo crashed ❌", err)
        process.exit(1)
    }
}

module.exports = connectDB
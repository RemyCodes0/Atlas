const mongoose = require("mongoose")


const curationSchema = mongoose.Schema({
    user:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
},{
        timestamps: true
    })


module.exports = mongoose.model("curation", curationSchema)



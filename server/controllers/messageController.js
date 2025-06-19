const Message = require("../models/Message")

const getMessages = async(req, res)=>{
    try{
        const messages = await Message.find({chamber: req.params.chamber}).sort({timestamp:1})
        res.json(messages)
    }catch(err){
        res.status(500).json({error: "Failed to fetch messages"})
    }
}

module.exports = getMessages
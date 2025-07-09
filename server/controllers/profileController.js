const User = require("../models/User")

const getUser =  async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
}

const updateUser = async(req, res)=>{
    const updates = req.body
    try{
    const user = await User.findByIdAndUpdate(req.user.id, updates,{ new: true}).select("-password")
    if (!user){
        return res.status(404).json({msg: "No such user in the database"})
    }
    res.json(user)
    }catch(err){
        return res.status(500).json(err)
    }
}

const deleteUser = async(req, res) =>{
    const user = await User.findByIdAndDelete(req.user.id)
    res.json({msg: "User deleted"})
}

module.exports = {updateUser, deleteUser, getUser}
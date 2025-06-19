const User = require("../models/User")

const getUser =  async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
}

const updateUser = async(req, res)=>{
    const updates = req.body
    const user = await User.findByIdAndUpdate(req.user.id, updates,{ new: true}).select("-password")
    res.json(user)
}

const deleteUser = async(req, res) =>{
    const user = await User.findByIdAndDelete(req.user.id)
    res.json({msg: "User deleted"})
}

module.exports = {updateUser, deleteUser, getUser}
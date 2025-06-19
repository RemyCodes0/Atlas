const User = require("../models/User")

const updateUser= async(req,res)=>{
    try{
        const _id= req.params.id
        const {newRole} = req.body
        const updatedUser =await User.findByIdAndUpdate(_id, {role: newRole},{
            new: true,
        });
        if(!updatedUser){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json({message: `server error ${err}`})
    }
}

const listUsers = async(req,res)=>{
    try{
        const users = await User.find()
        res.status(200).json({users})
    }catch(err){
        res.status(500).json({message: "server error", err})
    }
}

const fireUser = async(req,res)=>{
    const userId = req.params.id
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        await User.findByIdAndDelete(userId)
        res.json({message:"User deleted sucessfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }

}



module.exports = {updateUser, listUsers, fireUser}
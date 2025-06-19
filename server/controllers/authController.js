const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async(req, res) =>{
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({msg:"User already exists"})
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET,{
            expiresIn: "1d"
        });
        res.status(201).json({
            token,
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        })
    }catch(err){
        res.status(500).json({msg:"server error", error: err.message})
    }
}

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({msg: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid Credentials"})
        }

        const token =jwt.sign({id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn:"1d"})
        res.status(200).json({
            token,
            user:{
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        })
    }catch(err){
        res.status(500).json({msg: "server error", error: err})
    }
}



module.exports = {registerUser, loginUser}
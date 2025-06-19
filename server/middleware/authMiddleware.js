const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect =async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader&& authHeader.startsWith("Bearer ")){
        const token = authHeader.split(" ")[1];
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password")
        if(!user) return res.status(401).json({msg:"User not found"})

        req.user = user
        next()
    }catch(err){
        return res.status(401).json({msg: "Tokent is not valid"})
    }
    }else{
        return res.status(401).json({msg: "No token authorization denied"})
    }
}


module.exports = protect
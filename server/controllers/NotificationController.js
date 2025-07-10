const Notification = require("../models/Notification")
const User = require("../models/User")
const transporter = require("../utils/mailer")

const createNotification = async(req, res)=>{
    try{
        if(req.user.role !== "CEO"){
            return res.status(403).json({msg: "Forbiddent: Not authorized"})
        }

        const {description} = req.body
        if(!description || !req.file){
            return res.status(400).json({msg:"Description and image are required"})
        }
        const newNotification = new Notification({
            description,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newNotification.save()
        const users = await User.find({}, "email");
        const recipients = users.map(user=> user.email)
        
        const mailOptions = {
            from: 'Amea | Atlas',
            to: recipients,
            subject: "📢 New Notification",
            html: `
        <h3>New Notification</h3>
        <p>${newNotification.description}</p>
        ${
          newNotification.imageUrl
            ? `<img src="${process.env.SIMPLE_API_URL}${newNotification.imageUrl}" alt="Notification Image" style="max-width:100%;height:auto;"/>`
            : ""
        }
      `,
        }
        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.error("Error sending email:", error)

            }else{
                console.log("Email sent:", info.response)
            }
        })
        



        res.status(201).json(newNotification)
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Server error"})
    }
}

const getNotifications = async(req, res)=>{
    try{
        const notifications = await Notification.find().sort({createdAt: -1})
        res.json(notifications);
    }catch(err){
        console.error(err)
        res.status(500).json({msg: "server error"})
    }
}


const deleteNotification = async(req, res)=>{
    const notificationId = req.params.id;
    try{
        const notification = await Notification.findByIdAndDelete(notificationId)
        res.status(200).json({msg: "The Notification was successfull"})
    }catch(err){
        res.status(500).json({msg: "A server error happened", error: err})
    }
}

module.exports = {getNotifications, createNotification, deleteNotification}
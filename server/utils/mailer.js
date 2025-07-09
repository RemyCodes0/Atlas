const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: "tuyishimechristophe84@gmail.com",
        pass:"dtjr ddzw nfgm jqoo"
    }
})


transporter.verify(function(error, success){
    if(error){
        console.error("Error connecting to SMTP server:", error)
    }else{
        console.log("SMTP server is ready to take messages")
    }
})

module.exports = transporter;
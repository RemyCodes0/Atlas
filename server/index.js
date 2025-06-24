const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")
const {Server} = require("socket.io")
const http = require("http")
const Message = require("./models/Message")
const messageRouter = require("./routes/message")
const userRouter = require('./routes/user')
const taskRoutes = require("./routes/task")
dotenv.config()

connectDB()

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(cors())



const PORT = process.env.PORT || 5000

app.get("/", (req,res)=>{
    res.send("API is runnung...")
})

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRouter)
app.use("/api/user", userRouter )
app.use("/api/tasks", taskRoutes)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


io.on("connection", (socket)=>{
    console.log("New client connected", socket.id)
    socket.on('sendMessage', async (data)=>{
        try{
            const savedMessage = await Message.create({
                sender: data.sender,
                role: data.role,
                message: data.message,
                chamber: data.chamber
            })
        io.emit("receiveMessage", savedMessage)

        }catch(err){
            console.error("Failed to save messaeg", err)
        }
    }
)

    socket.on("disconnect", ()=>{
        console.log("Client disconnected:", socket.id)
    })
})

server.listen(PORT, ()=>{
    console.log("The server is running at:👍", PORT)
})



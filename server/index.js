const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/Message");
const messageRouter = require("./routes/message");
const userRouter = require("./routes/user");
const taskRoutes = require("./routes/task");
const path = require("path");
const notificationRouter = require("./routes/notification");
const curationRouter = require("./routes/curation");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://atlas-amea.vercel.app'
];

app.use(express.json());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRoutes);
app.use("/api/notification/", notificationRouter);
app.use("/api/curate", curationRouter);

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on('sendMessage', async (data) => {
    try {
      const savedMessage = await Message.create({
        sender: data.sender,
        role: data.role,
        avatar: data.avatar,
        message: data.message,
        chamber: data.chamber
      });
      io.emit("receiveMessage", savedMessage);
    } catch (err) {
      console.error("Failed to save message", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("The server is running at:👍", PORT);
});

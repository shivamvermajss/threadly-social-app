const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const { initializeSocket } = require("./socket");

dotenv.config();

connectDB();

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://threadly-a-social-app-2o3p.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Make io available everywhere
app.set("io", io);

// Initialize Socket
initializeSocket(io);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://threadly-social-app.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Threadly API Running 🚀");
});

// Protected Test Route
app.get("/test", authMiddleware, (req, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
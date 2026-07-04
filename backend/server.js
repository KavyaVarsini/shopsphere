const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { initSocket } = require("./sockets/socket");
const userRoutes = require("./routes/userRoutes");


dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/users", userRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("ShopSphere Backend API Running 🚀");
});

// Initialize Socket.IO
initSocket(server);

// 🔥 Make socket available in routes
app.use((req, res, next) => {
  req.io = global.io;
  next();
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

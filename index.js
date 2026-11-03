const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const booksRoutes = require("./routes/books");
const borrowsRoutes = require("./routes/borrows");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://booknook-client-nine-xi.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/books", booksRoutes);
app.use("/borrows", borrowsRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("BookNook Server is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BookNook API is working!",
  });
});

// Start server
async function startServer() {
  try {
    const db = await connectDB();
    app.locals.db = db;

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 BookNook server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
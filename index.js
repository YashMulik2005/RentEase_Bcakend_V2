const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("@vendia/serverless-express");
require("dotenv").config();

const AuthRoutes = require("./route/AuthRoutes");

const app = express();

// Enable CORS
app.use(cors({ origin: "*" }));

// Middleware
app.use(express.json());

// Lazy MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("MongoDB Connected");
    } catch (err) {
      console.error("MongoDB Connection Error:", err);
    }
  }
}

// Connect DB when API is called
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api/auth", AuthRoutes);

// ✅ Add `app.listen()` only for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

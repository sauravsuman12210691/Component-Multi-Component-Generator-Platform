const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

dotenv.config();

// Load DB & Passport config
const connectDB = require("./config/db");
require("./config/passport");

// Load Routes
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const aiRoutes = require("./routes/aiRoutes"); // ✅ NEW AI Route

const app = express();

// --- MIDDLEWARES ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // dynamic origin
    credentials: true,
  })
);

app.use(express.json());

// --- EXPRESS SESSION CONFIG ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
    },
  })
);

// --- PASSPORT CONFIG ---
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes); // ✅ Mount the new AI routes

// --- START SERVER ---
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

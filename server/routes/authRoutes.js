const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { signup, login,getCurrentUser } = require("../controllers/authController");

// Email/Password auth
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

// --- Google OAuth Login ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// --- Google OAuth Callback ---
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }), // session is true if you're using sessions
  (req, res) => {
    // Issue JWT if needed (can also skip if using sessions)
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Redirect to frontend with token (or handle differently)
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;

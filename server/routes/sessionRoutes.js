const express = require("express");
const router = express.Router();
const {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
} = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all session routes
router.use(authMiddleware);

// POST /api/session → Create new session
router.post("/", createSession);

// GET /api/session → Get all user's sessions
router.get("/", getUserSessions);

// GET /api/session/:id → Get one session by ID
router.get("/:id", getSessionById);

// PATCH /api/session/:id → Update session data
router.patch("/:id", updateSession);

module.exports = router;

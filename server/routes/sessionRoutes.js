const express = require("express");
const router = express.Router();
const {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
  deleteSession,
  exportSession
} = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST /api/session → Create a new session
router.post("/", createSession);

// GET /api/session → Get all user's sessions
router.get("/", getUserSessions);

// GET /api/session/:id → Get a specific session
router.get("/:id", getSessionById);

// PATCH /api/session/:id → Update a session
router.patch("/:id", updateSession);

// DELETE /api/session/:id → Delete a session
router.delete("/:id", deleteSession);

// GET /api/session/:id/export → Export session data as file
router.get("/:id/export", exportSession);

module.exports = router;

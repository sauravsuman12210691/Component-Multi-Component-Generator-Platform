const express = require('express');
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
} = require('../controllers/sessionController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protect all session routes with authMiddleware
router.use(authMiddleware);

// Session Routes
router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;

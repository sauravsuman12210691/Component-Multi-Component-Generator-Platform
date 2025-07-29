const express = require('express');
const { generateComponent, tweakComponent } = require('../controllers/aiController.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', authMiddleware, generateComponent);
router.post('/tweak', authMiddleware, tweakComponent); // 👈 New endpoint

module.exports = router;

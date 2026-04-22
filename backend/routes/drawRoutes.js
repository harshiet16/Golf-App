const express = require('express');
const router = express.Router();
const drawController = require('../controllers/drawController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/results', drawController.getDrawResults);

// Admin Routes
router.post('/run', verifyToken, requireAdmin, drawController.runDraw);
router.get('/winners', verifyToken, requireAdmin, drawController.getWinners);
router.put('/winners/:id/verify', verifyToken, requireAdmin, drawController.verifyProof);

module.exports = router;

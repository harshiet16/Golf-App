const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', scoreController.getScores);
router.post('/', scoreController.addScore);
router.delete('/:id', scoreController.deleteScore);

module.exports = router;

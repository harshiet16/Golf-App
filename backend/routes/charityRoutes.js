const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', charityController.getCharities);

// Admin routes
router.post('/', verifyToken, requireAdmin, charityController.addCharity);
router.put('/:id', verifyToken, requireAdmin, charityController.updateCharity);
router.delete('/:id', verifyToken, requireAdmin, charityController.deleteCharity);

module.exports = router;

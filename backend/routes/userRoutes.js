const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/winners', userController.getMyWinners);
router.put('/winners/:id/proof', userController.uploadProof);

// Admin routes
router.get('/analytics', requireAdmin, userController.getAnalytics);
router.get('/', requireAdmin, userController.getAllUsers);
router.put('/:id', requireAdmin, userController.updateUserAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Admin routes
router.get('/', requireAdmin, userController.getAllUsers);
router.put('/:id', requireAdmin, userController.updateUserAdmin);

module.exports = router;

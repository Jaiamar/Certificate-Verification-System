const express = require('express');
const { getAllUsers, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

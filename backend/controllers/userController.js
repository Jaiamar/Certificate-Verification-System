const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.role) query.role = req.query.role;

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, error: { message: 'You cannot deactivate your own account', code: 'VALIDATION_ERROR' } });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found', code: 'NOT_FOUND' } });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, error: { message: 'You cannot delete your own account', code: 'VALIDATION_ERROR' } });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found', code: 'NOT_FOUND' } });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

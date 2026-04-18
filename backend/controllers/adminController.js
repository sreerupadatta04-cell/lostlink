const User = require('../models/User');
const Item = require('../models/Item');
const Message = require('../models/Message');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/admin/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports/messages
// @route   GET /api/admin/reports
const getAllReports = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('itemId', 'name category status')
      .sort({ createdAt: -1 });

    const stats = {
      totalUsers: await User.countDocuments(),
      totalItems: await Item.countDocuments(),
      foundItems: await Item.countDocuments({ status: 'found' }),
      recoveredItems: await Item.countDocuments({ status: 'recovered' }),
      totalMessages: await Message.countDocuments()
    };

    res.json({ messages, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Item.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllItems, getAllReports, deleteUser };

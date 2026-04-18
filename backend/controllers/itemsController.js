const QRCode = require('qrcode');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// @desc    Create new item
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { name, description, category, reward, imageUrl } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description and category are required' });
    }

    // Create item first to get qrCodeId
    const item = new Item({
      userId: req.user._id,
      name,
      description,
      category,
      reward: reward || '',
      imageUrl: imageUrl || null
    });

    // Generate QR code pointing to the scan page
    const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/scan/${item.qrCodeId}`;
    const qrCodeImage = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });

    item.qrCodeImage = qrCodeImage;
    await item.save();

    console.log(`🏷️ [ITEM REGISTERED] "${name}" by user ${req.user.email}`);
    console.log(`   QR Code ID: ${item.qrCodeId}`);
    console.log(`   Scan URL: ${qrUrl}`);

    res.status(201).json({
      message: 'Item registered successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items for logged in user
// @route   GET /api/items
const getItems = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
const getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('userId', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item status
// @route   PATCH /api/items/:id/status
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (status === 'recovered') {
      await Notification.create({
        userId: req.user._id,
        itemId: item._id,
        title: '🎉 Item Recovered!',
        message: `Your item "${item.name}" has been marked as recovered. Great news!`,
        type: 'item_recovered'
      });
    }

    res.json({ message: 'Status updated', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createItem, getItems, getItem, updateItemStatus, deleteItem };

const Message = require('../models/Message');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// @desc    Send message (finder reports found item)
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { itemId, message, finderName, finderContact, senderType } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({ message: 'Item ID and message are required' });
    }

    const item = await Item.findById(itemId).populate('userId');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const newMessage = await Message.create({
      itemId,
      senderType: senderType || 'finder',
      message,
      finderName: finderName || 'Anonymous Finder',
      finderContact: finderContact || 'Not provided'
    });

    // If finder is reporting, update item status to found
    if (senderType === 'finder' || !senderType) {
      await Item.findByIdAndUpdate(itemId, { status: 'found' });

      // Create notification for owner
      await Notification.create({
        userId: item.userId._id,
        itemId: item._id,
        title: '🔍 Your item has been found!',
        message: `Someone found your "${item.name}"! ${finderName || 'An anonymous finder'} has sent you a message.`,
        type: 'item_found'
      });

      // Simulate email/SMS notification
      console.log(`\n📧 [EMAIL SIMULATION] Sending notification to owner: ${item.userId.email}`);
      console.log(`   Subject: 🔍 Your item "${item.name}" has been found!`);
      console.log(`   Message: ${message}`);
      console.log(`   Finder: ${finderName || 'Anonymous'}`);
      console.log(`   Contact: ${finderContact || 'Not provided'}\n`);
    }

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for an item
// @route   GET /api/messages/:itemId
const getMessages = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only owner can see messages (protected route)
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ itemId: req.params.itemId })
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { itemId: req.params.itemId, senderType: 'finder', read: false },
      { read: true }
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Owner replies to finder
// @route   POST /api/messages/reply
const replyMessage = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reply = await Message.create({
      itemId,
      senderType: 'owner',
      message,
      finderName: req.user.name
    });

    // Create notification for awareness
    await Notification.create({
      userId: req.user._id,
      itemId: item._id,
      title: '💬 Reply sent',
      message: `You replied to a finder about your item "${item.name}"`,
      type: 'message_received'
    });

    console.log(`\n💬 [REPLY SIMULATION] Owner replied about "${item.name}"`);
    console.log(`   Reply: ${message}\n`);

    res.status(201).json({ message: 'Reply sent successfully', data: reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, replyMessage };

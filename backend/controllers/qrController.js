const Item = require('../models/Item');

// @desc    Get item by QR code ID (public route)
// @route   GET /api/qr/:qrCodeId
const getItemByQR = async (req, res) => {
  try {
    const item = await Item.findOne({ qrCodeId: req.params.qrCodeId })
      .populate('userId', 'name'); // Only return owner name, not email

    if (!item) {
      return res.status(404).json({ message: 'Item not found. This QR code may be invalid.' });
    }

    // Return limited info - no owner personal details
    const publicInfo = {
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status,
      qrCodeId: item.qrCodeId,
      reward: item.reward,
      registeredAt: item.createdAt,
      // Owner info is intentionally excluded for privacy
    };

    console.log(`📱 [QR SCANNED] Item "${item.name}" scanned - QR ID: ${item.qrCodeId}`);

    res.json({ item: publicInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItemByQR };

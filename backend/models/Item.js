const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Wallet/Purse', 'Keys', 'Bag/Backpack', 'Jewelry', 'Clothing', 'Documents', 'Pet', 'Other']
  },
  qrCodeId: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  qrCodeImage: {
    type: String  // base64 encoded QR image
  },
  status: {
    type: String,
    enum: ['safe', 'found', 'recovered'],
    default: 'safe'
  },
  imageUrl: {
    type: String,
    default: null
  },
  reward: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);

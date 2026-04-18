const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  senderType: {
    type: String,
    enum: ['finder', 'owner'],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  finderContact: {
    type: String,
    default: 'Anonymous'
  },
  finderName: {
    type: String,
    default: 'Anonymous Finder'
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

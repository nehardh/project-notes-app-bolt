const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  elements: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Whiteboard', whiteboardSchema); 
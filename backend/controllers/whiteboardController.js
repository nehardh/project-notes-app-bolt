const Whiteboard = require('../models/Whiteboard');

// Get whiteboard by user ID
exports.getWhiteboard = async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findOne({ userId: req.params.userId });
    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update whiteboard
exports.saveWhiteboard = async (req, res) => {
  try {
    const { userId, elements } = req.body;
    const whiteboard = await Whiteboard.findOneAndUpdate(
      { userId },
      { elements, lastModified: Date.now() },
      { new: true, upsert: true }
    );
    res.json(whiteboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 
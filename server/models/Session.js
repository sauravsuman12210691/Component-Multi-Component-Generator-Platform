const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  chatHistory: [
    {
      role: { type: String, enum: ['user', 'assistant'] },
      content: String,
      timestamp: String
    }
  ],
  componentCode: String,  // JSX
  cssCode: String,        // CSS
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);

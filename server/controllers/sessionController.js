const Session = require('../models/Session');

const createSession = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const session = await Session.create({
      user: req.userId,
      title,
      chatHistory: [],         // Optional: Initialize empty chat history
      componentCode: '',       // Optional: Empty code stub
      cssCode: ''
    });

    res.status(201).json(session); // 201 = Created
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ message: 'Server error while creating session' });
  }
};


const getSessions = async (req, res) => {
  const sessions = await Session.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(sessions);
};

const getSessionById = async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user: req.userId });
  res.json(session);
};

const updateSession = async (req, res) => {
  try {
    const { chatHistory, componentCode, cssCode } = req.body;
    const sessionId = req.params.id;

    // Find the session
    const session = await Session.findOne({ _id: sessionId, user: req.userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Update fields if provided
    if (chatHistory) session.chatHistory = chatHistory;
    if (componentCode) session.componentCode = componentCode;
    if (cssCode) session.cssCode = cssCode;

    const updated = await session.save();
    res.json(updated);

  } catch (err) {
    console.error('Error updating session:', err);
    res.status(500).json({ message: 'Server error while updating session' });
  }
};


const deleteSession = async (req, res) => {
  await Session.deleteOne({ _id: req.params.id, user: req.userId });
  res.sendStatus(204);
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};

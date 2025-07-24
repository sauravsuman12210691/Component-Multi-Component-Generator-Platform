const Session = require("../models/Session");

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const newSession = await Session.create({ userId: req.user });
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ message: "Failed to create session", err });
  }
};

// Get all sessions of the user
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user }).sort({ updatedAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions", err });
  }
};

// Get one session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch session", err });
  }
};

// Update session (chat, code, UI)
exports.updateSession = async (req, res) => {
  const { chatHistory, componentCode, componentCSS, uiState, title } = req.body;

  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user });
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (chatHistory) session.chatHistory = chatHistory;
    if (componentCode) session.componentCode = componentCode;
    if (componentCSS) session.componentCSS = componentCSS;
    if (uiState) session.uiState = uiState;
    if (title) session.title = title;

    await session.save();
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to update session", err });
  }
};

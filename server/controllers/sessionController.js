const Session = require("../models/Session");

// POST /api/session
exports.createSession = async (req, res) => {
  try {
    const { name } = req.body;
    const newSession = await Session.create({
      user: req.user._id,
      name: name || "Untitled Session",
    });
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to create session", error });
  }
};

// GET /api/session
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions", error });
  }
};

// GET /api/session/:id
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session", error });
  }
};

// PATCH /api/session/:id
exports.updateSession = async (req, res) => {
  try {
    const updates = req.body;
    updates.lastEdited = new Date();

    const updatedSession = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    if (!updatedSession) return res.status(404).json({ message: "Session not found" });

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to update session", error });
  }
};

// DELETE /api/session/:id
exports.deleteSession = async (req, res) => {
  try {
    const deleted = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Session not found" });

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete session", error });
  }
};

// GET /api/session/:id/export
exports.exportSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });

    if (!session) return res.status(404).json({ message: "Session not found" });

    const jsonContent = JSON.stringify(session, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="session-${session._id}.json"`);
    res.send(jsonContent);
  } catch (error) {
    res.status(500).json({ message: "Failed to export session", error });
  }
};

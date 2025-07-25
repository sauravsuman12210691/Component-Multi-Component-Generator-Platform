const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "Untitled Session",
    },
    components: [
      {
        name: String,
        code: String,
        preview: String, // Optional: if storing generated previews or exports
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastEdited: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);

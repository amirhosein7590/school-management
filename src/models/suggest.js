const mongoose = require("mongoose");

const suggestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ["problem", "suggest", "other"],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel",
  },

  senderModel: {
    type: String,
    required: true,
    enum: ["Manager", "Teacher"],
  },

  text: {
    type: String,
    required: true,
  },
});

const suggestModel =
  mongoose.models.Suggest || mongoose.model("Suggest", suggestSchema);

export default suggestModel;

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Types.ObjectId, required: true },
  receiver: { type: mongoose.Types.ObjectId, required: true },
  replay: {
    text: { type: String },
  },
});

const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;

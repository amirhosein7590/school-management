const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, unique: true }, // its not required just for default value
  password: { type: String }, // its not required just for default value
});

const ownerModel =
  mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

export default ownerModel;

const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  level: { type: Number, required: true, enum: [1, 2, 3] }, // برای دوره اول 1 و برای دوره دوم مدرسه 2
  shift: { type: String, required: true, enum: ["morning", "evening"] },
  phone: { type: String, required: true, unique: true },
  gender: {
    type: String,
    required: true,
    enum: ["boyish", "girlish", "mixed"],
  },
  manager: { type: mongoose.Types.ObjectId, ref: "Manager", required: false },
});

schoolSchema.virtual("teachers", {
  ref: "Teacher",
  localField: "_id",
  foreignField: "school",
});

schoolSchema.virtual("classes", {
  ref: "Class",
  localField: "_id",
  foreignField: "school",
});

const schoolModel =
  mongoose.models.School || mongoose.model("School", schoolSchema);

export default schoolModel;

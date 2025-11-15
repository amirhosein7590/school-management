const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school: { type: mongoose.Types.ObjectId, required: false, ref: "School" },
  teacher: { type: mongoose.Types.ObjectId, required: false, ref: "Teacher" },
  capacity: { type: Number, required: true }, //منظور ظرفیت هر کلاس هستش
});

classSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "class",
});

const classModel =
  mongoose.models.Class || mongoose.model("Class", classSchema);

export default classModel;

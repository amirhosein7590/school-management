const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school: { type: mongoose.Types.ObjectId, required: true, ref: "School" },
  teacher: { type: mongoose.Types.ObjectId, required: false, ref: "Teacher" },
  grade: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  capacity: { type: Number, required: true }, //منظور ظرفیت هر کلاس هستش
});

classSchema.index({ name: 1 });

classSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "class",
});

const classModel =
  mongoose.models.Class || mongoose.model("Class", classSchema);

export default classModel;

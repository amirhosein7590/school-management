const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationalCode: { type: String, required: true },
  parentPhone: { type: String, required: true },
  school: { type: mongoose.Types.ObjectId, required: false, ref: "School" },
  class: { type: mongoose.Types.ObjectId, required: false, ref: "Class" },
  teacher: { type: mongoose.Types.ObjectId, required: false, ref: "Teacher" },
  birthDay: { type: Date, required: true },
  grade: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
});

const studentModel =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default studentModel;

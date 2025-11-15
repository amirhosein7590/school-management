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
  grade: { type: Number, required: true }, // عددی که نشان دهنده کلاس 1 تا 12 است
}); 

const studentModel =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default studentModel;

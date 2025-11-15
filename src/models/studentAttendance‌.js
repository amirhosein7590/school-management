const { default: mongoose } = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Types.ObjectId, ref: "Student", required: true },
  class: { type: mongoose.Types.ObjectId, ref: "Class", required: true },
  teacher: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },

  date: { type: Date, required: true }, // فقط روز، بدون ساعت

  status: {
    type: String,
    enum: ["present", "absent", "excused", "late", "other"],
    required: true,
  },
  description: { type: String, required: false },

  createdAt: { type: Date, default: Date.now },
});

studentAttendanceSchema.index({ class: 1, date: 1 });
studentAttendanceSchema.index({ student: 1, date: 1 });
studentAttendanceSchema.index({ date: 1 });

const studentAttendanceModel =
  mongoose.models.StudentAttendance ||
  mongoose.model("StudentAttendance", studentAttendanceSchema);

export default studentAttendanceModel;


const { default: mongoose } = require("mongoose");

const teacherAttendanceSchema = new mongoose.Schema({
  teacher: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },
  manager: { type: mongoose.Types.ObjectId, ref: "Manager", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "excused", "late", "other", "leave"],
    required: true,
  },
  description: { type: String, required: false },
  time: { type: String, required: false }, // when status is late

  createdAt: { type: Date, default: Date.now },
});

teacherAttendanceSchema.index({ teacher: 1, date: 1 });
teacherAttendanceSchema.index({ manager: 1, date: 1 });
teacherAttendanceSchema.index({ date: 1 });
teacherAttendanceSchema.index({ manager: 1 });
teacherAttendanceSchema.index({ manager: 1, status: 1, teacher: 1 });

const teacherAttendanceModel =
  mongoose.models.TeacherAttendance ||
  mongoose.model("TeacherAttendance", teacherAttendanceSchema);

export default teacherAttendanceModel;

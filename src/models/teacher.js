import { hashPassword } from "../../utils/passwordConf";

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, unique: true }, // its not required just for default value
  password: { type: String }, // its not required just for default value
  phone: { type: String, required: true },
  nationalCode: { type: String, required: true },
  personnelCode: { type: String, required: true },
  isBanned: { type: Boolean, required: true },
  school: { type: mongoose.Types.ObjectId, required: false, ref: "School" },
  class: { type: mongoose.Types.ObjectId, required: false, ref: "Class" },
  manager: { type: mongoose.Types.ObjectId, required: false, ref: "Manager" },
  birthDay: { type: Date, required: true },
  gender: { type: String, required: true },
  role: {
    type: String,
    enum: ["teacher"],
    default: "teacher",
    immutable: true,
  },
  messages: [
    // for messages and notifications that manager will send !!
    {
      title: { type: String },
      body: { type: String },
      fromRole: { type: String },
    },
  ],
  absencePermissions: {
    excused: { type: Boolean, default: true },
    unexcused: { type: Boolean, default: true },
    late: { type: Boolean, default: true },
    other: { type: Boolean, default: true },
  },

  actionsPermissions: {
    createStudent: { type: Boolean, default: true },
    editStudent: { type: Boolean, default: true },
    deleteStudent: { type: Boolean, default: true },
  },
});

teacherSchema.index({ phone: 1 });

teacherSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.userName = this.nationalCode;
    this.password = await hashPassword(this.personnelCode);
  }
  next();
}); // set personnel code for password and national code for username in first time

teacherSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "teacher",
});

const teacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default teacherModel;

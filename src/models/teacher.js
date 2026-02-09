import { hashPassword } from "../utils/passwordConf";

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, unique: true }, // its not required just for default value
  password: { type: String }, // its not required just for default value
  phone: { type: String, required: true, unique: true },
  nationalCode: { type: String, required: true, unique: true },
  personnelCode: { type: String, required: true, unique: true },
  isBanned: { type: Boolean, required: true, default: false },
  school: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "School",
  },
  class: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Class",
  },
  manager: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Manager",
  },
  birthDay: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  role: {
    type: String,
    enum: ["teacher"],
    default: "teacher",
    immutable: true,
  },
  notifications: [
    {
      text: { type: String },
      status: { type: String, enum: ["info", "error", "success", "warning"] },
    },
  ],

  actionsPermissions: {
    studentAbsent: { type: Boolean, default: true }
  },
});

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

teacherSchema.virtual("suggests", {
  localField: "_id",
  ref: "Suggest",
  foreignField: "sender",
});

teacherSchema.index({ manager: 1, school: 1 });
teacherSchema.index({ school: 1 });
teacherSchema.index({ manager: 1 });
teacherSchema.index({ nationalCode: 1, phone: 1, personnelCode: 1 })

const teacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default teacherModel;

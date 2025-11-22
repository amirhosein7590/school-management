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
    unique: true,
  },
  class: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Class",
    unique: true,
  },
  manager: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Manager",
    unique: true,
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
    // for messages and notifications that manager will send !!
    {
      title: { type: String },
      body: { type: String },
      fromRole: { type: String },
    },
  ],

  actionsPermissions: {
    excused: { type: Boolean, default: true },
    unexcused: { type: Boolean, default: true },
    late: { type: Boolean, default: true },
    other: { type: Boolean, default: true },
    createStudent: { type: Boolean, default: true },
    editStudent: { type: Boolean, default: true },
    deleteStudent: { type: Boolean, default: true },
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

const teacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default teacherModel;

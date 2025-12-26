import { hashPassword } from "../utils/passwordConf";

const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, unique: true }, // its not required just for default value
  password: { type: String }, // its not required just for default value
  nationalCode: { type: String, required: true, unique: true },
  personnelCode: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["manager"],
    default: "manager",
    immutable: true,
  },
  gender: { type: String, required: true, enum: ["male", "female"] },
  school: {
    type: mongoose.Types.ObjectId,
    ref: "School",
    required: false,
    unique: true,
  },
  isBanned: { type: Boolean, required: true, default: false },
  expTime: {
    type: Number,
    required: true,
    default: Date.now() + Number(process.env.freePlanTime),
  }, // for future if anyone buy plan
  plan: { type: String, enum: ["free", "subscription"] }, // for fouture if anyone buy plan
  notifications: [
    // for messages and notifications that owner will send !!
    {
      title: { type: String },
      body: { type: String },
      fromRole: { type: String },
    },
  ],
  actionsPermissions: {
    createStudent: { type: Boolean, default: true },
    editStudent: { type: Boolean, default: true },
    deleteStudent: { type: Boolean, default: true },
    createTeacher: { type: Boolean, default: true },
    editTeacher: { type: Boolean, default: true },
    deleteTeacher: { type: Boolean, default: true },
    createClass: { type: Boolean, default: true },
    editClass: { type: Boolean, default: true },
    deleteClass: { type: Boolean, default: true },
    overrideSchoolSettings: { type: Boolean, default: true },
    teacherExcused: { type: Boolean, default: true },
    teacherUnexcused: { type: Boolean, default: true },
    teacherLate: { type: Boolean, default: true },
    teacherOther: { type: Boolean, default: true },
    studentExcused: { type: Boolean, default: true },
    studentUnexcused: { type: Boolean, default: true },
    studentLate: { type: Boolean, default: true },
    studentOther: { type: Boolean, default: true },
  },
});

managerSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.userName = this.nationalCode;
    this.password = await hashPassword(this.personnelCode);
  }
  next();
}); // set personnel code for password and national code for username in first time

managerSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.plan = "free";
    this.expTime = Date.now() + Number(process.env.freePlanTime);
  }
  next();
});

managerSchema.virtual("teachers", {
  ref: "Teacher",
  localField: "_id",
  foreignField: "manager",
});

const managerModel =
  mongoose.models.Manager || mongoose.model("Manager", managerSchema);

export default managerModel;

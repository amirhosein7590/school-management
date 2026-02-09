import { hashPassword } from "../utils/passwordConf";

const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String }, // its not required just for default value
  password: { type: String }, // its not required just for default value
  nationalCode: { type: String, required: true },
  personnelCode: { type: String, required: true },
  phone: { type: String, required: true },
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
  },
  isBanned: { type: Boolean, required: true, default: false },
  expTime: {
    type: Number,
    required: true,
    default: Date.now() + Number(process.env.freePlanTime),
  }, // for future if anyone buy plan
  plan: { type: String, enum: ["free", "subscription"] }, // for fouture if anyone buy plan
  messagesCharge: { type: Number, default: 0, required: false },
  notifications: [
    {
      text: { type: String },
      status: { type: String, enum: ["info", "error", "success", "warning"] },
    },
  ],
  birthDay: { type: Date, required: true },

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
    teacherAbsent: { type: Boolean, default: true },
    studentAbsent: { type: Boolean, defaut: true }
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

managerSchema.virtual("suggests", {
  localField: "_id",
  ref: "Suggest",
  foreignField: "sender",
});

managerSchema.index({ school: 1 });
managerSchema.index({ userName: 1, nationalCode: 1, phone: 1 });

const managerModel =
  mongoose.models.Manager || mongoose.model("Manager", managerSchema);

export default managerModel;

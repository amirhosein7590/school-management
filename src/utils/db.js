import mongoose from "mongoose";
import otpModel from "@/models/otp";
import teacherModel from "@/models/teacher";
import schoolModel from "@/models/school";
import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import studentModel from "@/models/student";
import messageModel from "@/models/message";
import suggestModel from "@/models/suggest";
import studentAttendanceModel from "@/models/studentAttendance";
import teacherAttendanceModel from "@/models/teacherAttendance";


export default async function connectToDb() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect("mongodb://localhost:27017/school");
  }
}

import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import ownerModel from "@/models/owner";
import connectToDb from "./db";

export default async function findUserByProps(fields = {}) {
  const query = {
    $or: Object.entries(fields).map(([key, value]) => ({ [key]: value })),
  };
  await connectToDb();
  const owner = await ownerModel.findOne(query);
  if (owner) return owner;

  const teacher = await teacherModel
    .findOne(query, "-actionsPermissions")
    .populate("school", "name _id")
    .populate("manager", "firstName lastName _id ")
    .populate("class", "name _id");

  if (teacher) return teacher.toObject();

  const manager = await managerModel
    .findOne(query, "-actionsPermissions")
    .populate("school", "name _id");

  if (manager) return manager.toObject();

  return null;
}

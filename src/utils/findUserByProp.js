import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "./db";
export default async function findUserByProp(propertyName, value) {
  await connectToDb();
  const owner = await ownerModel.findOne({ [propertyName]: value });
  if (owner) return owner;

  const teacher = await teacherModel
    .findOne({ [propertyName]: value })
    .populate("school", "name _id")
    .populate("manager", "firstName lastName _id ")
    .populate("class", "name _id");

  if (teacher) return teacher.toObject();

  const manager = await managerModel
    .findOne({ [propertyName]: value })
    .populate("school", "name _id");

  if (manager) return manager.toObject();

  return null;
}

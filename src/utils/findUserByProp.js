import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
export default async function findUserByProp(propertyName, value) {
  const owner = await ownerModel.findOne({ [propertyName]: value });
  if (owner) return owner;

  const teacher = await teacherModel
    .findOne({ [propertyName]: value })
    .populate("school")
    .populate("class")
    .populate("manager");

  if (teacher) return teacher.toObject();

  const manager = await managerModel
    .findOne({ [propertyName]: value })
    .populate("school");

  if (manager) return manager.toObject();

  return null;
}

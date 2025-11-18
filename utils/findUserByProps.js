import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import ownerModel from "@/models/owner";

export default async function findUserByProps(fields = {}) {
  const query = {
    $or: Object.entries(fields).map(([key, value]) => ({ [key]: value })),
  };

  const owner = await ownerModel.findOne(query);
  if (owner) return owner;

  const teacher = await teacherModel
    .findOne(query)
    .populate("school")
    .populate("class")
    .populate("manager");

  if (teacher) return teacher.toObject();

  const manager = await managerModel.findOne(query).populate("school");

  if (manager) return manager.toObject();

  return null;
}

import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "./db";
import { cache } from "./cache";

export default async function findUserByProp(propertyName, value) {
  const cacheKey = `${propertyName}:${value}`;

  const cachedUser = await cache.get(cacheKey);
  if (cachedUser) {
    return cachedUser;
  }

  await connectToDb();

  let user = null;

  const owner = await ownerModel.findOne({ [propertyName]: value });
  if (owner) {
    user = owner;
  } else {
    const teacher = await teacherModel
      .findOne({ [propertyName]: value }, "-actionsPermissions")
      .populate("school", "name _id")
      .populate("manager", "firstName lastName _id ")
      .populate("class", "name _id");

    if (teacher) {
      user = teacher;
    } else {
      const manager = await managerModel
        .findOne({ [propertyName]: value }, "-actionsPermissions")
        .populate("school", "name _id");

      if (manager) {
        user = manager;
      }
    }
  }

  if (user) {
    await cache.set(cacheKey, user, 300);
  }

  return user;
}

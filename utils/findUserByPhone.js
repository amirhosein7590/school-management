import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
export default async function findUserByPhone(phone) {
  return (
    (await ownerModel.findOne({ phone })) ||
    (await teacherModel.findOne({ phone })) ||
    (await managerModel.findOne({ phone }))
  );
}

import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import { isValidObjectId } from "mongoose";
import messageModel from "@/models/message";
import mongoose from "mongoose";

const configs = {
  owner: {
    model: ownerModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
  },
  teacher: {
    model: teacherModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
  },
  manager: {
    model: managerModel,
    receiverModel: teacherModel,
    receiverModelError: "معلم یافت نشد",
  },
};

export default async function Message(req, res) {
  try {
    await connectToDb();

    const auth = RBAC(req, res, ["owner", "teacher", "manager"], {
      status: false,
    });
    if (!auth) return;
    const { nationalCode, role } = auth;

    switch (req.method) {
      case "GET": {
        const ownerInfo = await ownerModel.findOne({});
        const user = await configs[role]?.model?.findOne({ nationalCode });
        if (!user) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }

        const { receiver: receiverId } = req.query;
        if (!receiverId) {
          return res
            .status(422)
            .json({ error: "اطلاعات مخاطب نامعتبر است", success: false });
        }

        const resolvedReceiverId = () => {
          if (receiverId === "owner") return ownerInfo?._id;

          if (receiverId === "manager" && role === "teacher") {
            return user.manager ?? null;
          }

          return receiverId;
        };

        const finalReceiverId = resolvedReceiverId();

        if (!finalReceiverId) {
          return res
            .status(422)
            .json({ error: "اطلاعات مخاطب نامعتبر است", success: false });
        }

        const receiverObjectId =
          typeof finalReceiverId === "string"
            ? new mongoose.Types.ObjectId(finalReceiverId)
            : finalReceiverId;

        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (page) {
          const messages = await messageModel.aggregate([
            {
              $match: {
                $or: [
                  {
                    sender: user._id,
                    receiver: receiverObjectId,
                  },
                  {
                    sender: receiverObjectId,
                    receiver: user._id,
                  },
                ],
              },
            },

            { $skip: skip },
            { $limit: limit },

            {
              $addFields: {
                isYouSend: {
                  $eq: ["$sender", user._id],
                },
              },
            },

            {
              $project: {
                __v: 0,
              },
            },
          ]);

          const total = await messageModel.countDocuments({
            $or: [
              { sender: user._id, receiver: receiverObjectId },
              { sender: receiverObjectId, receiver: user._id },
            ],
          });

          return res.json({
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const messages = await messageModel.aggregate([
            {
              $match: {
                $or: [
                  {
                    sender: user._id,
                    receiver: receiverObjectId,
                  },
                  {
                    sender: receiverObjectId,
                    receiver: user._id,
                  },
                ],
              },
            },

            {
              $addFields: {
                isYouSend: {
                  $eq: ["$sender", user._id],
                },
              },
            },

            {
              $project: {
                __v: 0,
              },
            },
          ]);

          return res.json({ messages, success: true });
        }
      }

      case "POST": {
        const { text, receiver: receiverId } = req.body;

        if (!text || !receiverId) {
          return res
            .status(422)
            .json({ error: "تمامی مقادیر الزامی است", success: false });
        }

        const user = await configs[role].model.findOne({ nationalCode });
        if (!user) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }

        if (receiverId === "owner" && role === "manager") {
          const owner = await ownerModel.findOne();
          if (!owner) {
            return res
              .status(404)
              .json({ error: "مدیر سیستم یافت نشد", success: false });
          }

          await messageModel.create({
            text,
            sender: user._id,
            receiver: owner._id,
          });

          return res
            .status(201)
            .json({ message: "پیام با موفقیت ارسال شد", success: true });
        } else if (receiverId == "manager" && role == "teacher") {
          const manager = await managerModel.findOne({ _id: user.manager });
          if (!manager) {
            return res
              .status(404)
              .json({ error: "مدیر یافت نشد", success: false });
          }
          await messageModel.create({
            text,
            sender: user._id,
            receiver: user.manager,
          });

          return res
            .status(201)
            .json({ message: "پیام با موفقیت ارسال شد", success: true });
        } else {
          const receiverInfo = await configs[role].receiverModel.findById(
            receiverId
          );
          if (!receiverInfo) {
            return res.status(404).json({
              error: configs[role].receiverModelError,
              success: false,
            });
          }

          await messageModel.create({
            text,
            sender: user._id,
            receiver: receiverInfo._id,
          });

          return res
            .status(201)
            .json({ message: "پیام با موفقیت ارسال شد", success: true });
        }
      }

      default: {
        return res
          .status(405)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}

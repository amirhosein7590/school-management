import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import { isValidObjectId } from "mongoose";
import messageModel from "@/models/message";
import findUserByProp from "@/utils/findUserByProp";

const configs = {
  owner: {
    model: ownerModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
  },
  manager: {
    model: managerModel,
    receiverModel: teacherModel,
    receiverModelError: "معلم یافت نشد",
  },
  teacher: {
    model: teacherModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
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
        const user = await configs[role]?.model?.findOne({ nationalCode });
        if (!user) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }

        const populateMessageUsers = async (message) => {
          const senderInfo = await findUserByProp("_id", message.sender);
          const receiverInfo = await findUserByProp("_id", message.receiver);

          return {
            _id: message._id,
            text: message.text,
            replay: message.replay,
            createdAt: message.createdAt, // اگر فیلد createdAt داری اضافه کن
            sender: {
              _id: senderInfo?._id,
              fullName: `${senderInfo?.firstName || ""} ${
                senderInfo?.lastName || ""
              }`.trim(),
              role: senderInfo?.role,
            },
            receiver: {
              _id: receiverInfo?._id,
              fullName: `${receiverInfo?.firstName || ""} ${
                receiverInfo?.lastName || ""
              }`.trim(),
              role: receiverInfo?.role,
            },
          };
        };

        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (page) {
          const [messages, total] = await Promise.all([
            messageModel
              .find({ $or: [{ sender: user._id }, { receiver: user._id }] })
              .skip(skip)
              .limit(limit),
            messageModel.countDocuments({
              $or: [{ sender: user._id }, { receiver: user._id }],
            }),
          ]);

          const formatedMessages = await Promise.all(
            messages.map(populateMessageUsers)
          );
          return res.json({
            messages: formatedMessages,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const [messages, total] = await Promise.all([
            messageModel
              .find({ $or: [{ sender: user._id }, { receiver: user._id }] })
              .skip(skip)
              .limit(limit),
            messageModel.countDocuments({
              $or: [{ sender: user._id }, { receiver: user._id }],
            }),
          ]);

          const formatedMessages = await Promise.all(
            messages.map(populateMessageUsers)
          );
          return res.json({ messages: formatedMessages, success: true });
        }
      }

      case "POST": {
        const { text, receiver } = req.body;

        if (!text || !receiver) {
          return res
            .status(422)
            .json({ error: "تمامی مقادیر الزامی است", success: false });
        }
        const config = configs[role];

        const user = await config.model.findOne({ nationalCode });
        if (!user) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }

        // حالت خاص: مدیر به مدیر سیستم پیام می‌دهد
        if (receiver[0] === "owner" && role === "manager") {
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
        } else {
          if (!isValidObjectId(receiver[0])) {
            return res
              .status(422)
              .json({ error: "شناسه گیرنده نامعتبر است", success: false });
          }

          const receiverInfo = await config.receiverModel.findById(receiver[0]);
          if (!receiverInfo) {
            return res
              .status(404)
              .json({ error: config.receiverModelError, success: false });
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
        return res.status(405).json({ error: "متد مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}

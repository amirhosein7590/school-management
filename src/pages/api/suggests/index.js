import connectToDb from "@/utils/db";
import findUserByProp from "@/utils/findUserByProp";
import RBAC from "@/utils/RBAC";
import suggestModel from "@/models/suggest";

export default async function Suggests(req, res) {
  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });
  if (!auth) return;

  const { nationalCode, role } = auth;
  try {
    await connectToDb();
    const user = await findUserByProp("nationalCode", nationalCode);
    if (!user) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    switch (req.method) {
      case "GET": {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (user.role != "owner") {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }
        if (page) {
          const [suggests, total] = await Promise.all([
            suggestModel
              .find({})
              .skip(skip)
              .limit(limit)
              .populate("sender", "_id firstName lastName phone nationalCode"),
            suggestModel.countDocuments({}),
          ]);
          return res.json({
            suggests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        }
        const suggests = await suggestModel
          .find({})
          .populate("sender", "_id firstName lastName phone nationalCode");

        return res.json({ suggests, success: true });
      }

      case "POST": {
        const exceptedProps = ["sender", "senderModel", "text", "subject"];

        const isBodyPropsValid = exceptedProps.every(
          (prop) => req.body[prop?.trim()],
        );
        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "فرمت یا مقدار فیلد نامعتبر نیست", success: false });
        }
        if (req.body.sender != user._id.toString()) {
          return res.status(403).json({
            error: "فقط با اطلاعات خودتان میتوانید این عملیات را انجام دهید",
            success: false,
          });
        }
        if (req.body.senderModel.toLowerCase() != user.role.toLowerCase()) {
          return res
            .status(422)
            .json({ error: "نقش فرستنده نامعتبراست", success: false });
        }
        if (!Array.isArray(req.body.subject)) {
          return res
            .status(422)
            .json({ error: "نوع بازخورد باید آرایه باشد", success: false });
        }
        await suggestModel.create({
          ...req.body,
          subject: req.body.subject[0],
        });
        return res.status(201).json({
          message: "پیشنهاد / انتقاد شما با موفقیت ارسال شد",
          success: true,
        });
      }

      default: {
        return res
          .status(400)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", success: false, dbError: error });
  }
}

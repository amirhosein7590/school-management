import { isValidObjectId } from "mongoose";
import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

export default async function managersPermissions(req, res) {
    const auth = RBAC(req, res, ["owner"], {
        status: false,
    });

    if (!auth) return;
    const { nationalCode } = auth;

    if (req.method != "POST") {
        return res
            .status(405)
            .json({ error: "این درخواست مجازنیست", success: false });
    }

    const { managerId, permissions } = req.body

    if (!managerId || !isValidObjectId(managerId?.[0])) {
        return res.status(422).json({ error: "آیدی مدیر نادرست است", success: false })
    }

    if (permissions.length < 1) {
        return res.status(422).json({ error: "محدودیت نامشخص است", success: false })
    }

    try {
        await connectToDb();
        const owner = await ownerModel.findOne({ nationalCode });
        if (!owner) {
            return res.status(403).json({
                error: "شما مجاز به انجام این عملیات نیستید",
                success: false,
            });
        }

        const manager = await managerModel.findOne({ _id: managerId?.[0] });
        if (!manager) {
            return res.status(404).json({ error: "مدیر یافت نشد", success: false });
        }

        for (let permission of permissions) {
            if (!manager.actionsPermissions?.[permission] == undefined) {
                return res.status(422).json({ error: "محدودیت یافت نشد", success: false })
            }
            manager.actionsPermissions[permission] = !manager.actionsPermissions[permission];
            await manager.save();
        }

        return res.json({ message: "محدودیت اعمال شد", success: true })

    } catch (error) {
        return res.status(500).json({ error: "خطای ناشناخته", success: false });
    }
}
const managerPermissionsConfig = {
    inputs: {
        owner: [
            {
                type: "select",
                name: "managerId",
                placeholder: "مدیر",
                className: "!text-sm !rounded-[5px] mb-5",
                rules: {
                    required: "لطفا مدیر را وارد نمایید",
                },
                multiple: false,
                options: {
                    url: "/managers",
                    method: "get",
                    key: "managers",
                    deps: null,
                    isPrivate: true,
                    headers: null,
                    optionsGenerator: (data) => {
                        if (!data) return [];
                        const managers = data?.map((manager) => ({
                            label: `${manager.firstName} ${manager.lastName}`,
                            value: manager._id,
                        }));
                        return managers;
                    },
                    dataArrayName: "managers",
                },
            },
            {
                type: "select",
                name: "permissions",
                placeholder: "محدودیت",
                className: "!text-sm !rounded-[5px] mb-5",
                rules: {
                    required: "لطفا محدودیت را وارد نمایید",
                },
                multiple: true,
                options: [
                    { label: "ایجاد دانش آموز", value: "createStudent" },
                    { label: "ویرایش دانش آموز", value: "editStudent" },
                    { label: "حذف دانش آموز", value: "deleteStudent" },
                    { label: "ایجاد معلم", value: "createTeacher" },
                    { label: "ویرایش معلم", value: "editTeacher" },
                    { label: "حذف معلم", value: "deleteTeacher" },
                    { label: "ایجاد کلاس", value: "createClass" },
                    { label: "ویرایش کلاس", value: "editClass" },
                    { label: "حذف کلاس", value: "deleteClass" },
                    { label: "ویرایش اطلاعات مدرسه", value: "overrideSchoolSettings" },
                    { label: "ثبت غیبت معلمان", value: "teacherAbsent" }
                ]
            },
        ],
    },
    url: "/managers/permissions",
    method: "post",
    key: "permissions",
    headers: { "content-type": "application/json" },
    deps: null,
    isPrivate: true,
}

export default managerPermissionsConfig
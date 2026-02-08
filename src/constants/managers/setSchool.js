const setSchoolConfig = {
    inputs: {
        owner: [
            {
                type: "select",
                name: "schoolId",
                placeholder: "مدرسه",
                className: "!text-sm !rounded-[5px] mb-5",
                rules: {
                    required: "لطفا مدرسه را وارد نمایید",
                },
                multiple: false,
                options: {
                    url: "/schools",
                    method: "get",
                    key: "schools",
                    deps: null,
                    isPrivate: true,
                    headers: null,
                    optionsGenerator: (data) => {
                        if (!data) return [];
                        const schools = data?.map((school) => ({
                            label: school.name,
                            value: school._id,
                        }));
                        return schools;
                    },
                    dataArrayName: "schools",
                },
            },
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
        ],
    },
    url: "/managers/setSchool",
    method: "post",
    key: "setSchool",
    headers: { "content-type": "application/json" },
    deps: null,
    isPrivate: true,
}

export default setSchoolConfig
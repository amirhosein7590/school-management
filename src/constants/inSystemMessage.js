const inSystemMessageConfig = {
  inputs: {
    teacher: [
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا مخاطب را مشخص کنید",
        },
        multiple: false,
        placeholder: "مخاطب",
        options: [{ label: "مدیر", value: "manager" }],
      },
    ],
    manager: [
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا گیرنده را مشخص کنید",
        },
        multiple: false,
        placeholder: "گیرنده",
        options: {
          url: "/teachers",
          method: "get",
          key: "teachers",
          deps: null,
          isPrivate: true,
          headers: null,
          optionsGenerator: (data) => {
            if (!data) return [];
            const teachers = data?.map((teacher) => ({
              label: `${teacher.firstName} ${teacher.lastName}`,
              value: teacher._id,
            }));
            return [{ label: "مدیر سیستم", value: "owner" }, ...teachers];
          },
          dataArrayName: "teachers",
        },
      },
    ],
    owner: [
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا گیرنده را مشخص کنید",
        },
        multiple: false,
        placeholder: "گیرنده",
        options: {
          url: "/managers",
          method: "get",
          key: "managers",
          deps: null,
          isPrivate: true,
          headers: null,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data.map((manager) => ({
              label: `${manager.firstName} ${manager.lastName}`,
              value: manager._id,
            }));
          },
          dataArrayName: "managers",
        },
      },
    ],
  },
  url: "/messages",
  method: "post",
  key: "messages",
  deps: null,
  isPrivate: true,
  headers: { "content-type": "application/json" },
};

export default inSystemMessageConfig;

const teachersClassificationConfig = {
  inputs: {
    manager: [
      {
        type: "select",
        placeholder: "کلاس",
        name: "classId",
        rules: {
          required: "کلاس انتخاب نشده است",
        },
        className: "w-full lg:w-4/12",
        multiple: false,
        options: {
          url: "/classes",
          method: "get",
          key: "classes",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data?.map((cls) => ({
              label: cls.name,
              value: cls._id,
            }));
          },
          dataArrayName: "classes",
        },
      },
      {
        type: "select",
        name: "teacherId",
        placeholder: "معلم",
        rules: {
          required: "معلم انتخاب نشده است",
        },
        className: "w-full lg:w-4/12",
        multiple: false,
        options: {
          url: "/teachers",
          method: "get",
          key: "teachers",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data || !data) return [];
            return data?.map((teacher) => ({
              label: `${teacher.firstName} ${teacher.lastName}`,
              value: teacher._id,
            }));
          },
          dataArrayName: "teachers",
        },
      },
    ],
  },
  url: "/teachers/classification",
  method: "post",
  key: "teachers",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
};

export default teachersClassificationConfig;

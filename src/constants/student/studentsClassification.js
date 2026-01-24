const studentsClassificationConfig = {
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
        name: "studentIds",
        placeholder: "دانش آموز",
        rules: {
          required: "دانش آموز انتخاب نشده است",
        },
        className: "w-full lg:w-4/12",
        multiple: true,
        options: {
          url: "/students",
          method: "get",
          key: "students",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data || !data) return [];
            return data?.map((student) => ({
              label: `${student.firstName} ${student.lastName}`,
              value: student._id,
            }));
          },
          dataArrayName: "students",
        },
      },
    ],
  },
  url: "/students/classification",
  method: "post",
  key: "students",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
};

export default studentsClassificationConfig;

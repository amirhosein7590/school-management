import { useForm, Controller } from "react-hook-form";
import { Input } from "./input";
import Select from "./select";
import { Button } from "./Button/button";
import { memo, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useEntityMutation from "@/hooks/formMutations/useEntityMutation";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import DatePicker from "./datePicker";
import { Skeleton } from "./skeleton";
import { Search } from "lucide-react";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useQueryClient } from "@tanstack/react-query";
import TimePicker from "./timePicker";
import ImportFromExcel from "./Button/importFromExcel";

function Form({
  mode,
  entityName,
  className,
  submitButtonText,
  submitButtonClassName,
  afterSubmitFn,
  bodyReq,
  user = null,
  inputsContainerClassName,
  entityId,
  queryOptions = {},
  search = false,
  validSearchProps = [],
  countEntityButton = false,
  clearFormButton = true,
  submitButton = true,
  searchEndPoint = true,
  datePickerPortal = true,
  exportToExcel = false,
  importFromExcel = false,
  importFromExcelButtonText = "",
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending, config } = useEntityMutation(entityName, entityId);

  const { data, isPending: inputsPending } = useCustomeQuery(
    config?.inputs?.key,
    config?.inputs?.deps,
    config?.inputs?.url,
    config?.inputs?.headers,
    config?.inputs?.isPrivate,
    queryOptions,
    mode == "edit" && config?.inputs?.url ? true : false,
  );

  const searchUrl = searchEndPoint ? `${config?.url}/search` : config?.url;

  const { mutate: searchMutate, isPending: searchPending } = useCustomeMutation(
    config?.key,
    config?.deps,
    searchUrl,
    config?.headers,
    "post",
    true,
  );

  const { mutate: countEntityMutate, isPending: countEntiyPending } =
    useCustomeMutation(
      `${config?.key}/search`,
      config?.deps,
      `${config?.url}/quantity`,
      { "content-type": "application/json" },
      "post",
      true,
    );

  const { mutate: attendanceAllMutate, isPending: attendanceAllPending } =
    useCustomeMutation(
      config?.key,
      config?.deps,
      `${config?.url}/all`,
      { "content-type": "application/json" },
      "post",
      true,
    );

  const defaultValues = useMemo(() => {
    if (mode === "edit" && data && config?.inputs) {
      const values = {};
      const dataSource = config?.inputs?.dataProp
        ? data[config?.inputs.dataProp]
        : data;

      config?.inputs[user?.role].forEach((input) => {
        if (dataSource && dataSource[input.name] !== undefined) {
          if (input.type == "select") {
            values[input.name] = [String(dataSource[input.name])];
          } else {
            values[input.name] = String(dataSource[input.name]);
          }
        }
      });

      return values;
    }
    return {};
  }, [data, mode, config?.inputs]);

  const {
    control,
    formState: { errors, submitCount },
    reset,
    handleSubmit,
    getValues,
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit", defaultValues });

  const searchHandler = () => {
    const values = getValues();

    const fillFields = validSearchProps.reduce((acc, curr) => {
      if (
        values[curr] &&
        (Array.isArray(values[curr]) ? values[curr].length > 0 : true)
      ) {
        acc[curr] = values[curr];
      }
      return acc;
    }, {});
    searchMutate(fillFields, {
      onSuccess: (response) => {
        const finalKey = [config.key, config.deps];
        queryClient.setQueryData(finalKey, (oldData) => {
          return {
            pages: [
              {
                [config?.dataArrayName]: response[config?.dataArrayName],
              },
            ],
            pageParams: [undefined],
          };
        });
      },
    });
  };

  const countEntityHandler = () => {
    countEntityMutate({});
  };

  const attendanceAllHandler = (status) => {
    const date = getValues()["date"];
    if (!date) {
      toast.error("لطفا تاریخ را وارد کنید");
      return;
    }
    attendanceAllMutate({ date, status });
  };

  const { exportToExcelConfig } = config;

  const exportToExcelHandler = async () => {
    if (!exportToExcel || !exportToExcelConfig) return;
    const data = queryClient.getQueryData([config?.key, config?.deps]);
    const flatData = () => {
      if (!data || !data.pages) return [];
      const arr = data.pages.flatMap((p) => p?.[config?.dataArrayName] ?? []);
      return arr;
    };
    if (flatData()?.length < 1) {
      toast.error("رکوردی برای خروجی اکسل ، وجود ندارد");
      return;
    }

    await exportToExcelConfig(flatData);
  };

  useEffect(() => {
    if (mode === "edit" && data && inputs && !inputsPending) {
      reset(defaultValues);
    }
  }, [data, mode, reset, inputsPending, defaultValues]);

  useEffect(() => {
    const errorMessage = Object.values(errors)[0]?.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errors, submitCount]);

  const submit = useCallback(
    async (data) => {
      const finalData = bodyReq ? { ...data, ...bodyReq } : data;
      try {
        const result = await mutate(finalData, {});
        afterSubmitFn && afterSubmitFn({ ...result, ...finalData });
        return result;
      } catch (error) {}
    },
    [mutate],
  );
  const inputs = config.inputs?.all || config.inputs[user.role];

  const inputGenerator = (input, field) => {
    if (mode == "edit" && inputsPending) {
      return (
        <div className="flex flex-col gap-10">
          <Skeleton className={`h-4 w-full`} />
        </div>
      );
    }

    const commonProps = {
      name: field.name,
      value: field.value || "",
      onChange: field.onChange,
      onBlur: field.onBlur,
      className: input?.className,
      placeholder: input.placeholder,
      ...input,
    };

    switch (input.type) {
      case "select": {
        return <Select {...commonProps} values={field.value || ""} />;
      }
      case "textarea": {
        return <Textarea {...commonProps} />;
      }
      case "datePicker": {
        return (
          <DatePicker
            {...commonProps}
            value={field.value ?? null}
            onChange={(value) => {
              field.onChange(value);
            }}
            size="sm"
            datePickerPortal={datePickerPortal}
          />
        );
      }

      case "timePicker": {
        return (
          <TimePicker
            {...commonProps}
            value={field.value}
            onChange={(t) =>
              field.onChange(
                `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(
                  2,
                  "0",
                )}`,
              )
            }
          />
        );
      }
      default: {
        return <Input {...commonProps} />;
      }
    }
  };

  return (
    <form dir="rtl" onSubmit={handleSubmit(submit)} className={className}>
      <div className={`inputs-container ${inputsContainerClassName}`}>
        {inputs &&
          inputs.map((input) => (
            <Controller
              control={control}
              name={input.name}
              key={input.name}
              rules={input.rules}
              render={({ field }) => <>{inputGenerator(input, field)}</>}
            />
          ))}
      </div>

      <div className="buttons-container flex flex-col lg:flex-row lg:items-center">
        {submitButton && (
          <Button
            disabled={isPending}
            className={`rounded-[3px] cursor-pointer ${submitButtonClassName}`}
            type="submit"
            size="sm"
          >
            {isPending ? <Spinner size="sm" /> : submitButtonText}
          </Button>
        )}

        <div className="w-full lg:w-auto mt-4 lg:mr-2 lg:mt-0 flex lg:justify-start items-center gap-x-2 flex-wrap gap-y-2">
          {search && (
            <Button
              disabled={searchPending}
              className="rounded-[3px] flex justify-center items-center cursor-pointer bg-[var(--base-orange)] hover:bg-[var(--base-orange)] border-[var(--base-orange)]"
              size="sm"
              varinat="ghost"
              onClick={searchHandler}
              type="button"
            >
              {searchPending ? <Spinner size="sm" /> : "جستجو"}
              <Search />
            </Button>
          )}
          {mode == "attendance" && (
            <>
              <Button
                type="button"
                onClick={() => attendanceAllHandler("present")}
                className="present-for-all cursor-pointer rounded-[3px] !bg-green-200 !text-green-600"
                variant="ghost"
                size="sm"
              >
                حضور همه
              </Button>

              <Button
                type="button"
                onClick={() => attendanceAllHandler("absent")}
                className="present-for-all cursor-pointer rounded-[3px] !bg-red-200 !text-red-600"
                variant="ghost"
                size="sm"
              >
                غیبت غیر موجه همه
              </Button>
            </>
          )}
          {clearFormButton && (
            <Button
              variant="outline"
              type="button"
              onClick={() => reset({})}
              className="clear-form-button cursor-pointer rounded-[3px]"
            >
              پاک کردن فرم
            </Button>
          )}
          {countEntityButton && (
            <Button
              onClick={countEntityHandler}
              type="button"
              disabled={!countEntityButton || countEntiyPending}
              variant="outline"
              className="count-of-entity-button cursor-pointer rounded-[3px] "
            >
              {countEntiyPending ? <Spinner size="sm" /> : "تعداد"}
            </Button>
          )}
          {exportToExcel && (
            <Button
              type="button"
              onClick={exportToExcelHandler}
              size="sm"
              variant="ghost"
              disabled={!exportToExcel}
              className="bg-green-600 text-white cursor-pointer rounded-[3px]"
            >
              خروجی اکسل
            </Button>
          )}
          {importFromExcel && (
            <ImportFromExcel
              disabled={!importFromExcel || !importFromExcelButtonText}
              queryKey={config?.key}
              text={importFromExcelButtonText}
              user={user}
              importConfig={config?.importFromExcelConfig}
            />
          )}
        </div>
      </div>
    </form>
  );
}

export default memo(Form);

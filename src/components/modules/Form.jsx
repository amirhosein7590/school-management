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
}) {
  const { mutate, isPending, config } = useEntityMutation(entityName, entityId);

  const { data, isPending: inputsPending } = useCustomeQuery(
    config?.inputs?.key,
    config?.inputs?.deps,
    config?.inputs?.url,
    config?.inputs?.headers,
    config?.inputs?.isPrivate,
    mode == "edit" && config?.inputs?.url ? true : false
  );

  const defaultValues = useMemo(() => {
    if (mode === "edit" && data && config?.inputs) {
      const values = {};
      const dataSource = config?.inputs?.dataProp
        ? data[config?.inputs.dataProp]
        : data;

      config?.inputs[user?.role].forEach((input) => {
        if (dataSource && dataSource[input.name] !== undefined) {
          values[input.name] = dataSource[input.name];
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
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit", defaultValues });

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
    [mutate]
  );
  const inputs = config.inputs?.all || config.inputs[user.role];

  const inputGenerator = (input, field) => {
    if (mode == "edit" && inputsPending) {
      return <Skeleton className="h-6 rounded-none w-[250px]" />;
    }

    const commonProps = {
      name: field.name,
      value: field.value || "",
      onChange: field.onChange,
      onBlur: field.onBlur, // مهم: onBlur هم باید پاس داده شود
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
      <Button
        disabled={isPending}
        className={`rounded-[3px] cursor-pointer ${submitButtonClassName}`}
        type="submit"
        size="sm"
      >
        {isPending ? <Spinner size="sm" /> : submitButtonText}
      </Button>
    </form>
  );
}

export default memo(Form);

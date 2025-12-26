import { useForm, Controller } from "react-hook-form";
import { Input } from "./input";
import Select from "./select";
import { Button } from "./Button/button";
import { memo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import useEntityMutation from "@/hooks/formMutations/useEntityMutation";
import { Spinner } from "./spinner";

function Form({
  mode,
  entityName,
  className,
  submitButtonText,
  submitButtonClassName,
  afterSubmitFn,
  bodyReq,
  user = null,
}) {
  const {
    control,
    formState: { errors, submitCount },
    reset,
    handleSubmit,
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });

  useEffect(() => {
    const errorMessage = Object.values(errors)[0]?.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errors, submitCount]);

  const { mutate, isPending, config } = useEntityMutation(entityName);

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

  const inputs = config.inputs?.all || config.inputs[user];

  return (
    <form onSubmit={handleSubmit(submit)} className={className}>
      {inputs.map((input) => (
        <Controller
          control={control}
          name={input.name}
          key={input.name}
          rules={input.rules}
          render={({ field }) => (
            <>
              {input.type == "select" ? (
                <Select
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              ) : (
                <Input
                  type={input.type}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  className={input?.className}
                  placeholder={input.placeholder}
                />
              )}
            </>
          )}
        />
      ))}
      <Button
        disabled={isPending}
        className={submitButtonClassName}
        type="submit"
      >
        {isPending ? <Spinner size="sm" /> : submitButtonText}
      </Button>
    </form>
  );
}

export default memo(Form);

import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";
import PageGuide from "@/components/modules/pageGuide";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import inSystemMessageConfig from "@/constants/inSystemMessage";
import Select from "@/components/modules/select";
import { Button } from "@/components/modules/Button/button";
import { useModal } from "@/contexts/ModalContext";
import MessageModalContent from "@/components/templates/InSystemMessage/messageModalContent";
import Head from "next/head";

function InSystemMessage({ user }) {
  const inputs = inSystemMessageConfig.inputs[user.role];
  const { control, getValues,reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { showModal } = useModal();

  const sendMessageHandler = () => {
    const { receiver } = getValues();
    if (!receiver?.[0]) {
      toast.error("لطفا مخاطب را انتخاب کنید");
      return;
    }
    showModal({
      title: "گفتگو",
      size: "2xl",
      content: ({ close }) => (
        <MessageModalContent receiverId={getValues()?.receiver} close={close} />
      ),
    });
  };
  return (
    <>
      <Head>
        <title>پیام درون سامانه ای</title>
        <meta name="description" content="صفحه پیام درون سامانه ای" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          entityName="inSystemMessage"
          pageName="ارسال پیام درون سامانه ای"
        />
        <form className="flex flex-col lg:flex-row lg:items-center gap-x-0 gap-y-4 lg:gap-x-4 lg:gap-y-0">
          {inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name}
              rules={input.rules}
              control={control}
              render={({ field }) => (
                <Select
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={input?.className}
                  placeholder={input.placeholder}
                  values={field.value || ""}
                  {...input}
                />
              )}
            />
          ))}
          <Button
            type="button"
            className="flex justify-center items-center"
            size="sm"
            onClick={sendMessageHandler}
          >
            شروع گفتگو
          </Button>
        </form>
      </div>
    </>
  );
}

export default memo(InSystemMessage);

export const getServerSideProps = requireRole("inSystemMessage")();

import useCustomeQuery from "@/hooks/useCustomeQuery";
import { Button } from "./Button/button";
import {
  Menu,
  LayoutDashboard,
  UserCheck,
  Settings,
  GraduationCap,
  Users,
  School,
  UserRoundPen,
  Backpack,
  Bell,
  MessageCircle,
  MessageSquareWarning,
  ChevronDown,
  CircleUserRound,
  User,
  ShoppingCart,
  Lock,
  LogOut,
  House,
} from "lucide-react";

import { memo, useEffect, useState } from "react";
import { Popover, PopoverTrigger } from "./popover";
import { PopoverContent } from "@radix-ui/react-popover";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useRouter } from "next/router";
import homeConfig from "@/constants/home";
import { useModal } from "@/contexts/ModalContext";
import Notification from "./Notification";
import Form from "./Form";

const icons = {
  Menu,
  LayoutDashboard,
  UserCheck,
  Settings,
  GraduationCap,
  Users,
  School,
  UserRoundPen,
  Backpack,
  Bell,
  MessageCircle,
  MessageSquareWarning,
  CircleUserRound,
  ChevronDown,
  User,
  ShoppingCart,
  Lock,
  LogOut,
  House,
};

function Nav({ user }) {
  const router = useRouter();
  const { data, isPending } = useCustomeQuery(
    "me",
    null,
    "/auth/me",
    { "content-type": "application/json" },
    true
  );
  const { showModal } = useModal();
  const [isSideBarShow, setIsSideBarShow] = useState(false);
  const gender = data?.user?.gender == "male" ? "آقای" : "خانم";
  const fullName = `${data?.user?.firstName} ${data?.user?.lastName}`;
  const { mutate: logoutMutate, isPending: logoutPending } = useCustomeMutation(
    "logut",
    null,
    "/auth/logout",
    null,
    "get",
    true
  );
  const logout = () => {
    logoutMutate(null, {
      onSuccess: () => {
        router.push("/auth/login");
      },
    });
  };
  const sideBarShowHandler = () => {
    setIsSideBarShow((prev) => !prev);
  };

  const showNotifications = () => {
    showModal({
      title: "اعلانات",
      size: "lg",
      content: ({ close }) => {
        const {
          data: { user },
        } = useCustomeQuery(
          "me",
          null,
          "/auth/me",
          { "content-type": "application/json" },
          true
        );
        return (
          <div dir="rtl" className="notification-container flex flex-col">
            {user?.notifications && user?.notifications?.length > 0 ? (
              user.notifications.map((notif) => (
                <Notification key={notif._id} {...notif} />
              ))
            ) : (
              <p className="text-center text-sm">
                اعلانی برای نمایش وجود ندارد
              </p>
            )}
          </div>
        );
      },
    });
  };

  const suggestHandler = () => {
    showModal({
      title: "انتقادات / پیشنهادات",
      content: ({ close }) => {
        const senderModel =
          user.role.slice(0, 1).toUpperCase() + user.role.slice(1);
        return (
          <Form
            user={user}
            bodyReq={{ sender: data?.user?._id, senderModel }}
            afterSubmitFn={close}
            entityName="suggest"
            submitButtonText="ثبت"
            submitButtonClassName="bg-green-500 cursor-pointer mt-4 px-4 rounded-sm"
          />
        );
      },
    });
  };

  return (
    <nav className="flex">
      <header
        dir="rtl"
        className="w-full bg-[var(--dark-blue)] p-4 lg:w-10/12 flex items-center justify-between"
      >
        <div className="school-name flex items-center gap-x-4">
          <Button
            onClick={sideBarShowHandler}
            variant="ghost"
            className="!p-0 block lg:hidden"
          >
            <icons.Menu color="white" className="!w-5 !h-5" />
          </Button>
          <p className="text-white sans-bold text-sm lg:text-lg">
            {user?.role == "owner"
              ? "مالک"
              : data?.user && data?.user?.school?.name}
          </p>
        </div>
        <div className="toolbar flex gap-x-4 lg:gap-x-2 items-center">
          <Button
            className="suggests cursor-pointer !items-center !p-0 lg:p-auto lg:!py-2 lg:!px-3"
            tooltip="ثبت پیشنهاد / انتقاد"
            variant="ghost"
            onClick={suggestHandler}
          >
            <icons.MessageSquareWarning
              color="white"
              style={{ width: "20px", height: "20px" }}
            />
          </Button>
          <Button
            className="inner-site-message !items-center cursor-pointer !p-0 lg:p-auto lg:!py-2 lg:!px-3"
            tooltip="ارسال پیام درون سامانه ای"
            variant="ghost"
            href="/school/inSystemMessage"
          >
            <icons.MessageCircle
              color="white"
              style={{ width: "20px", height: "20px" }}
            />
          </Button>
          <Button
            className="notifications !items-center !p-0 lg:p-auto lg:!py-2 lg:!px-3 cursor-pointer relative"
            tooltip="اعلانات"
            variant="ghost"
            onClick={showNotifications}
          >
            {data?.user?.notifications?.length > 0 && (
              <span className="bg-red-600 text-white w-5 h-5 rounded-full absolute top-0 right-1 flex justify-center items-center text-xs">
                {data?.user?.notifications?.length}
              </span>
            )}
            <icons.Bell
              color="white"
              style={{ width: "20px", height: "20px" }}
            />
          </Button>
        </div>
      </header>
      {isSideBarShow && (
        <div
          onClick={sideBarShowHandler}
          className="overlay h-[100vh] w-[100w] bg-[rgba(0,0,0,0.2)] fixed inset-0"
        ></div>
      )}
      <nav
        className={`fixed ${
          isSideBarShow ? "right-0 z-10" : "-right-1000"
        }  lg:right-0 flex flex-col w-8/12 lg:w-2/12 h-full transition-all duration-300 animate-in overflow-y-auto`}
      >
        <div
          dir="rtl"
          className="profile gap-y-2 flex flex-col pt-8 pb-4 px-4 bg-[var(--light-blue)]"
        >
          <icons.CircleUserRound size={50} color="white" />
          <div className="profile-info flex items-center justify-between">
            <span className="text-xs lg:text-sm text-white">
              {data?.user && gender} {data?.user && fullName}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="cursor-pointer" variant="ghost">
                  <icons.ChevronDown color="white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className=" w-50 py-2 bg-white shadow-sm rounded-sm">
                <ul className="flex flex-col !gap-y-3">
                  <li className="w-full flex items-center cursor-pointer transition duration-300 hover:bg-gray-50 px-4">
                    <icons.User color="#000000DE" size={20} />
                    <Button
                      variant="ghost"
                      className="text-[#000000DE] !px-0 mr-2 cursor-pointer"
                      href="/school/profile"
                    >
                      پروفایل
                    </Button>
                  </li>
                  {user?.role == "manager" && (
                    <li className="w-full flex items-center cursor-pointer transition duration-300 hover:bg-gray-50 px-4">
                      <icons.ShoppingCart color="#000000DE" size={20} />
                      <Button
                        variant="ghost"
                        className="text-[#000000DE] !px-0 mr-2 cursor-pointer"
                      >
                        بسته ها
                      </Button>
                    </li>
                  )}
                  <li className="w-full flex items-center cursor-pointer transition duration-300 hover:bg-gray-50 px-4">
                    <icons.Lock color="#000000DE" size={20} />
                    <Button
                      variant="ghost"
                      className="text-[#000000DE] !px-0 mr-2 cursor-pointer"
                      href="/school/changePassword"
                    >
                      تغییر رمز عبور
                    </Button>
                  </li>
                  <li className="w-full flex items-center cursor-pointer transition duration-300 hover:bg-gray-50 px-4">
                    <icons.LogOut color="#000000DE" size={20} />
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="text-[#000000DE] !px-0 mr-2 cursor-pointer"
                    >
                      {logoutPending ? "در حال خروج" : "خروج"}
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="links bg-white h-full">
          <ul dir="rtl" className="flex flex-col gap-y-3">
            <Button
              className="flex items-center !text-sm sans-medium !py-6 lg:text-[16px] gap-x-2 w-full rounded-none transition duration-300 cursor-pointer"
              variant="ghost"
              href="/school/home"
              isActiveAware={true}
              activeClass="bg-gray-100"
            >
              <icons.House style={{ width: "20px", height: "20px" }} />
              صفحه اصلی
            </Button>
            {homeConfig.buttons[user.role].map((button) => {
              const IconComponent = icons[button.icon];
              return (
                <Button
                  key={button.id}
                  className="flex items-center !text-sm sans-medium !py-6 lg:text-[16px] gap-x-2 w-full rounded-none transition duration-300 cursor-pointer hover:bg-gray-50"
                  variant="ghost"
                  href={button.href}
                  isActiveAware={true}
                  activeClass="bg-gray-100"
                >
                  <IconComponent style={{ width: "20px", height: "20px" }} />
                  {button.text}
                </Button>
              );
            })}
          </ul>
        </div>
      </nav>
    </nav>
  );
}

export default memo(Nav);

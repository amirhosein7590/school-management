import { requireRole } from "@/lib/requireRole";
import React, { memo, useState } from "react";
import homeConfig from "@/constants/home";
import {
  LayoutDashboard,
  UserCheck,
  Settings,
  GraduationCap,
  Users,
  School,
  UserRoundPen,
  Backpack,
  Notebook,
} from "lucide-react";
import { Button } from "@/components/modules/Button/button";
import DatePicker from "react-multi-date-picker";

const icons = {
  LayoutDashboard,
  UserCheck,
  Settings,
  GraduationCap,
  Users,
  School,
  UserRoundPen,
  Backpack,
  Notebook,
};
function Home({ user }) {
  return (
    <div className="w-full">
      <div
        dir="rtl"
        className="
      links
      grid
      grid-cols-3
      md:grid-cols-4
      lg:grid-cols-6
      gap-3 sm:gap-4 md:gap-6 lg:gap-10
      px-4
      py-2
    "
      >
        {user?.role &&
          homeConfig.buttons[user.role].map((button) => {
            const IconComponent = icons[button.icon];
            if (!IconComponent) return null;

            return (
              <Button
                key={button.id}
                href={button.href}
                variant="ghost"
                className="
              bg-white
              h-24 md:h-28
              px-1 sm:px-2
              shadow-md
              rounded-lg
              flex
              flex-col
              items-center
              justify-center
              gap-1 md:gap-2
              transition
              hover:shadow-md
              hover:bg-gray-50
            "
              >
                <IconComponent
                  className="
                text-[var(--dark-blue)]
                !w-5 !h-5
                md:!w-6 md:!h-6
              "
                />
                <span
                  className="
    text-[11px]
    sm:text-xs
    md:text-sm
    text-gray-700
    text-center
    leading-tight
    line-clamp-2
    break-word
    text-wrap
    mt-1
  "
                >
                  {button.text}
                </span>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

export default memo(Home);

export const getServerSideProps = requireRole("home")();

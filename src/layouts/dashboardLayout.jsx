import Nav from "@/components/modules/Nav";
import { memo } from "react";

function DashboardLayout({ children, user }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Nav user={user} />

      <div className="flex flex-col flex-grow container w-full md:w-10/12">
        <main className="mt-5 flex-grow">{children}</main>

        <footer className="text-center text-sm p-6 bg-[#f5f5f5] text-[#000000de]">
          سامانه مداد | نسخه 0.1.0
        </footer>
      </div>
    </div>
  );
}

export default memo(DashboardLayout);

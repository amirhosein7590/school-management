import "@/styles/globals.css";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/contexts/ModalContext";
import "react-multi-date-picker/styles/layouts/mobile.css";
import DashboardLayout from "@/layouts/dashboardLayout";
import { UserContext } from "@/contexts/UserContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient({}));
  const getLayout =
    Component.getLayout ||
    ((page) => {
      if (
        Component.name === "ErrorPage" ||
        pageProps.statusCode ||
        !pageProps.user
      ) {
        return <>{page}</>;
      }

      return <DashboardLayout user={pageProps.user}>{page}</DashboardLayout>;
    });

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} position="left" /> */}
      <HydrationBoundary state={pageProps.dehydratedState}>
        <UserContext.Provider value={pageProps.user || null}>
          <ModalProvider>
            {getLayout(<Component {...pageProps} />)}
          </ModalProvider>
        </UserContext.Provider>
        <Toaster
          dir="rtl"
          className="!-mx-8 lg:!mx-0"
          richColors
          position="top-center"
        />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

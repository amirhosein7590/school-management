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
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        // defaultOptions: {
        //   queries: {
        //     staleTime: 1000 * 60 * 5,
        //     gcTime: 1000 * 60 * 30,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: true,
        //     refetchOnMount: false,
        //     retry: 1,
        //   },
        //   mutations: {
        //     retry: 0,
        //   },
        // },
      })
  );
  const getLayout =
    Component.getLayout ||
    ((page) => <DashboardLayout user={pageProps.user}>{page}</DashboardLayout>);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} position="right" /> */}
      <HydrationBoundary state={pageProps.dehydratedState}>
        <UserContext.Provider value={pageProps.user || null}>
          <ModalProvider>
            {getLayout(<Component {...pageProps} />)}
          </ModalProvider>
        </UserContext.Provider>{" "}
        <Toaster dir="rtl" richColors position="top-center" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

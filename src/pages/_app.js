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

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <DashboardLayout user={page.props.user}>{page}</DashboardLayout>
    ));

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <UserContext.Provider value={pageProps.user || null}>
          <ModalProvider>
            {getLayout(<Component {...pageProps} />)}
          </ModalProvider>
        </UserContext.Provider>{" "}
        <Toaster richColors position="top-center" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

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


export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
        <Toaster richColors position="top-center" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

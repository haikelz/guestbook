import {
  NEXT_PUBLIC_DEVELOPMENT_URL,
  NEXT_PUBLIC_PRODUCTION_URL,
} from "@/lib/utils/constants";
import "@/styles/globals.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { useState } from "react";
import SeoConfig from "../../next-seo.config";
import { trpc } from "../lib/utils/trpc";

const appAnimation = {
  transition: { duration: 0.27 },
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  const queryClient = new QueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${
            process.env.NODE_ENV === "development"
              ? NEXT_PUBLIC_DEVELOPMENT_URL
              : NEXT_PUBLIC_PRODUCTION_URL
          }/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <SessionProvider session={session}>
        <style jsx global>{`
          body {
            font-family: ${geistSans.style.fontFamily};
          }

          .prose pre,
          pre code {
            font-family: ${geistMono.style.fontFamily};
          }
        `}</style>
        <NextSeo {...SeoConfig} />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ChakraProvider value={defaultSystem}>
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </SessionProvider>
    </trpc.Provider>
  );
}

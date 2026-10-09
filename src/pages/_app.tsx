import {
  NEXT_PUBLIC_DEVELOPMENT_URL,
  NEXT_PUBLIC_PRODUCTION_URL,
} from "@/lib/utils/constants";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { useState } from "react";
import SeoConfig from "../../next-seo.config";
import { trpc } from "../lib/utils/trpc";

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
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
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
    }),
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
        <Provider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Component {...pageProps} />
          </QueryClientProvider>
        </Provider>
      </SessionProvider>
    </trpc.Provider>
  );
}

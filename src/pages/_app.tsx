import {
  NEXT_PUBLIC_DEVELOPMENT_URL,
  NEXT_PUBLIC_PRODUCTION_URL,
  SITE_URL,
} from "@/lib/utils/constants";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../lib/utils/trpc";

const inter = Inter({ subsets: ["latin"] });

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
        {/* On :root so portalled HeroUI overlays share the face. */}
        <style>{`:root { --font-inter: ${inter.style.fontFamily}; }`}</style>
        <Head>
          <title key="title">Guestbook · ekel.dev</title>
          <meta
            key="description"
            name="description"
            content="Leave a note for Haikel and read messages from visitors to ekel.dev."
          />
          <meta key="og:type" property="og:type" content="website" />
          <meta key="og:site_name" property="og:site_name" content="ekel.dev" />
          <meta key="og:locale" property="og:locale" content="en_US" />
          <meta key="og:image" property="og:image" content={`${SITE_URL}/og.png`} />
          <meta key="og:image:width" property="og:image:width" content="1920" />
          <meta key="og:image:height" property="og:image:height" content="1080" />
          <meta key="og:image:alt" property="og:image:alt" content="guestbook.ekel.dev" />
          <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
          <meta
            key="theme-color-light"
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#f9fafc"
          />
          <meta
            key="theme-color-dark"
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#0b0d12"
          />
        </Head>
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

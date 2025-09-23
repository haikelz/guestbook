import LiquidEther from "@/components/liquid-ether";
import { Toaster } from "@/components/ui/toaster";
import {
  NEXT_PUBLIC_DEVELOPMENT_URL,
  NEXT_PUBLIC_PRODUCTION_URL,
} from "@/lib/utils/constants";
import "@/styles/globals.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
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
        <Provider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ChakraProvider value={defaultSystem}>
              <div
                style={{ width: "100%", height: "100vh", position: "relative" }}
              >
                <LiquidEther
                  colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                  mouseForce={20}
                  cursorSize={100}
                  isViscous={false}
                  viscous={30}
                  iterationsViscous={32}
                  iterationsPoisson={32}
                  resolution={0.5}
                  isBounce={false}
                  autoDemo={true}
                  autoSpeed={0.5}
                  autoIntensity={2.2}
                  takeoverDuration={0.25}
                  autoResumeDelay={3000}
                  autoRampDuration={0.6}
                />
                <div
                  style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflow: "hidden",
                    position: "absolute",
                  }}
                >
                  <Component {...pageProps} />
                </div>
              </div>
              <Toaster />
            </ChakraProvider>
          </QueryClientProvider>
        </Provider>
      </SessionProvider>
    </trpc.Provider>
  );
}

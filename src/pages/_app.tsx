import LiquidEther from "@/components/react-bits/liquid-ether";
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
import { useRouter } from "next/router";
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
  const router = useRouter();
  const usesLiquidEther = router.pathname !== "/dashboard/admin";
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
            {usesLiquidEther ? (
              <div
                style={{ width: "100%", height: "100vh", position: "relative" }}
              >
                <LiquidEther
                  colors={["#2563EB", "#38BDF8", "#93C5FD"]}
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
            ) : (
              <Component {...pageProps} />
            )}
          </QueryClientProvider>
        </Provider>
      </SessionProvider>
    </trpc.Provider>
  );
}

import "@/styles/globals.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { RecoilRoot } from "recoil";
import SeoConfig from "../../next-seo.config";

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

  return (
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
      <RecoilRoot>
        <NextSeo {...SeoConfig} />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ChakraProvider value={defaultSystem}>
            <LazyMotion features={domAnimation}>
              <AnimatePresence mode="wait" initial={false}>
                <Component {...pageProps} />
              </AnimatePresence>
            </LazyMotion>
          </ChakraProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

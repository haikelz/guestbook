import { DefaultSeoProps } from "next-seo";

const SeoConfig: DefaultSeoProps = {
  defaultTitle: "Guestbook",
  description: "Guestbook for ekel.dev Website",
  openGraph: {
    type: "website",
    locale: "en",
    siteName: "https://guestbook.ekel.dev",
    title: "guestbook.ekel.dev",
    images: [
      {
        url: "https://guestbook.ekel.dev/og.png",
        width: 1200,
        height: 630,
        alt: "Og Image",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
    site: "https://guestbook.ekel.dev",
  },
  additionalMetaTags: [
    {
      name: "theme-color",
      content: "#000000",
    },
    {
      name: "msapplication-navbutton-color",
      content: "#000000",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "#000000",
    },
  ],
};

export default SeoConfig;

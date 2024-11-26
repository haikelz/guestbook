import { DefaultSeoProps } from "next-seo";

const SeoConfig: DefaultSeoProps = {
  defaultTitle: "Guestbook",
  description: "Guestbook for ekel.dev Website",
  openGraph: {
    type: "website",
    locale: "en",
  },
};

export default SeoConfig;

import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default class RootDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <body>
          {/* Apply the saved theme before first paint so dark users never see a light flash. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var t=localStorage.getItem("guestbook-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

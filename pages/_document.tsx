import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="Create programmatic videos at scale using Airtable"
        />
        <meta name="theme-color" content="rgba(59,130,246,.5)" />
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID && (
          <script
            async
            defer
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID}
            src="https://analytics.rewindtable.com/umami.js"
          ></script>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

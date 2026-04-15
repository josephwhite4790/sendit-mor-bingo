import Head from "next/head";
import "../styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sendit-mor-bingo.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const TITLE = "Sendit MOR Bingo";
const OG_TITLE = "Sendit MOR Bingo — Bingo for Medical Directors";
const DESCRIPTION =
  "Generate a bingo card for your next operations meeting. Because you know they're going to say it.";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="48x48" href="/apple-touch-icon.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sendit" />
        <meta property="og:title" content={OG_TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sendit MOR Bingo preview" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={OG_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

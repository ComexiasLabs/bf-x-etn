import { getGATrackingId } from '@modules/analytics/ga';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const trackingId = getGATrackingId();

  return (
    <Html lang="en">
      <Head>
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${trackingId}');
              `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

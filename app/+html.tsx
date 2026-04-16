import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#0A0806" />
        <meta name="description" content="Medical precision meets spa-level comfort. Timeless RN Wellness Spa — West Nashville, est. 2017." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Timeless RN" />
        <link rel="apple-touch-icon" href="/assets/images/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/images/icon.png" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Timeless RN Wellness Spa" />
        <meta property="og:title" content="Timeless RN Wellness Spa" />
        <meta property="og:description" content="Medical precision meets spa-level comfort. Your wellness is an experience, not a chore. West Nashville — est. 2017." />
        <meta property="og:url" content="https://timelessrn.com" />
        <meta property="og:image" content="https://timelessrn.com/assets/images/icon.png" />
        <meta property="og:image:alt" content="Timeless RN Wellness Spa" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Timeless RN Wellness Spa" />
        <meta name="twitter:description" content="Medical precision meets spa-level comfort. West Nashville — est. 2017." />
        <meta name="twitter:image" content="https://timelessrn.com/assets/images/icon.png" />
        <meta name="twitter:image:alt" content="Timeless RN Wellness Spa" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          * { -webkit-text-stroke: 0.1px white; }
          [style*="color: rgb(255, 255, 255)"],
          [style*="color:rgb(255, 255, 255)"],
          [style*="color: rgb(245, 239, 228)"],
          [style*="color:rgb(245, 239, 228)"] {
            -webkit-text-stroke: 0px;
          }
          [style*="Jost_300Light"],
          [style*="Jost_200ExtraLight"] {
            -webkit-text-stroke: 0.05px white;
          }
          [style*="color: rgb(10, 8, 6)"],
          [style*="color:rgb(10, 8, 6)"] {
            -webkit-text-stroke: 0.03px white;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}

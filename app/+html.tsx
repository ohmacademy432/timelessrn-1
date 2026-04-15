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
        <meta name="description" content="Timeless RN Wellness Spa" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Timeless RN" />
        <link rel="apple-touch-icon" href="/assets/images/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/images/icon.png" />
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

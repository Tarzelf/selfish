import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

const ink = '#0F0D10';
const bone = '#F0E8DF';

export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Selfish</title>
        <meta name="description" content="Intimate audio for rest and desire." />
        <meta name="theme-color" content={ink} />
        <meta name="color-scheme" content="dark" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `html,body,#root{height:100%;background:${ink};color:${bone}}body{overflow:hidden}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

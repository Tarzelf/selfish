import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

/** Static web document. Paint the floor dark before any JS theme runs. */
export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: '#060608' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#060608" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: 'html,body,#root{background-color:#060608!important;color:#F5F5F7!important;min-height:100%;height:100%}body{overflow:hidden}#root{display:flex}',
          }}
        />
      </head>
      <body style={{ backgroundColor: '#060608', color: '#F5F5F7' }}>{children}</body>
    </html>
  );
}

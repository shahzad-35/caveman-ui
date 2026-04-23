import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Caveman Compression — Strip grammar. Keep facts. Save tokens.',
  description: 'Lossless semantic compression for LLM contexts. Browser-based, free, instant.',
  openGraph: {
    title: 'Caveman Compression',
    description: 'Strip grammar. Keep facts. Save tokens.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'OCRacle — The Ghost Label Detector | AI-Powered Greenwashing Detector',
  description:
    'Get an instant, unbiased Truth Score (0–10) for any consumer product. OCRacle exposes greenwashing by cross-referencing Open Food Facts, EPD, and Carbon Trust databases. Scan now — free.',
  keywords: ['greenwashing', 'sustainability', 'AI', 'product scanner', 'truth score', 'eco label', 'OCR'],
  openGraph: {
    title: 'OCRacle — The Ghost Label Detector',
    description: 'AI-powered truth scoring for sustainable consumer choices.',
    type: 'website',
    url: 'https://ocracle.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OCRacle — The Ghost Label Detector',
    description: 'Exposing greenwashing, one scan at a time.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}


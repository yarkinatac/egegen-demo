import type { Metadata } from 'next';
import './globals.css';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Coffee Shop – Taze Kahve',
    template: '%s | Coffee Shop',
  },
  description:
    'Özenle seçilmiş kahve çekirdeklerinden hazırlanan taze kahveler. Dünyanın en iyi yörelerinden kapınıza kadar.',
  keywords: ['kahve', 'cappuccino', 'espresso', 'coffee shop', 'taze kahve', 'özel kahve'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Coffee Shop',
    title: 'Coffee Shop – Taze Kahve',
    description:
      'Özenle seçilmiş kahve çekirdeklerinden hazırlanan taze kahveler.',
    images: [{ url: '/hero-coffee-cup.png', width: 1024, height: 1024, alt: 'Coffee Shop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Shop – Taze Kahve',
    description:
      'Özenle seçilmiş kahve çekirdeklerinden hazırlanan taze kahveler.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-teal-dark antialiased">{children}</body>
    </html>
  );
}

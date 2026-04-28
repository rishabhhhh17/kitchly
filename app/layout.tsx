import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MetaPixel } from '@/components/MetaPixel';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kitchly.co.in'),
  title: {
    default: 'Kitchly — Kitchen tools that earn their counter spot',
    template: '%s · Kitchly'
  },
  description:
    'Heirloom-grade cookware, utensils and serveware made for Indian kitchens. Free shipping on orders over ₹1,499.',
  openGraph: {
    title: 'Kitchly — Kitchen tools that earn their counter spot',
    description:
      'Heirloom-grade cookware, utensils and serveware made for Indian kitchens.',
    url: 'https://kitchly.co.in',
    siteName: 'Kitchly',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-cream-50 antialiased">
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

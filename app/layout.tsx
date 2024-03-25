// layout.tsx

import './globals.css';
import Navbar from './Navbar';
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from './components/GoogleAnalyics';
import CookieBanner from '@/app/components/CookieBanner';
import { AppStateProvider } from './contexts/StateContext';
import { Suspense } from 'react';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'TLDL',
  description: "Too Long Didn't Listen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_MEASUREMENT_ID="G-Z6WGLHLZXB" />
      <body className="w-full max-w-full bg-base text-baseText">
        <AppStateProvider>
          <nav className="fixed top-0 z-50 w-full">
            <Navbar />
          </nav>
          <div className="flex min-h-screen flex-col bg-base pt-32">
            <Suspense fallback={<div>Loading...</div>}>
              <main className="flex-grow overflow-y-auto">{children}</main>
            </Suspense>
            <footer className="flex w-full justify-center bg-base2 py-4 font-light"></footer>
          </div>
        </AppStateProvider>
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CivicProvider } from '../context/CivicContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ToastNotification } from '../components/ToastNotification';
import { DemoControlsDrawer } from '../components/DemoControlsDrawer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CivicPulse — See a problem. Speak up. Get it moving.',
  description: 'Human-centered civic problem aggregation platform that converts individual complaints into collective civic signal for community priority and escalation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fbf9f5] text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
        <CivicProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {children}
          </main>
          <Footer />
          <ToastNotification />
          <DemoControlsDrawer />
        </CivicProvider>
      </body>
    </html>
  );
}

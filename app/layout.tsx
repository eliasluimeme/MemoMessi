import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast-context';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Signals Platform',
  description: 'Get real-time crypto signals and track your performance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ToastProvider>{children}</ToastProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

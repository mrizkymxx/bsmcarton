import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppLayout from '@/components/layout/app-layout';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CartonFlow',
  description: 'Cardboard carton production management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
            <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

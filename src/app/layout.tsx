import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppLayout from '@/components/layout/app-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AppLayout>{children}</AppLayout>
              <Toaster />
            </ThemeProvider>
      </body>
    </html>
  );
}

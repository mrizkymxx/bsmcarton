
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Roboto, Poppins } from 'next/font/google';
import AppLayout from '@/components/layout/app-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '700'],
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
  const fontScript = `
    (function() {
      try {
        const font = localStorage.getItem('font') || 'inter';
        const fontSize = localStorage.getItem('fontSize') || 'base';
        
        const root = document.documentElement;
        root.style.setProperty('--font-sans', 'var(--font-' + font + ')');

        if (fontSize === 'sm') {
          root.style.setProperty('--font-size-base', '14px');
        } else if (fontSize === 'base') {
          root.style.setProperty('--font-size-base', '16px');
        } else if (fontSize === 'lg') {
          root.style.setProperty('--font-size-base', '18px');
        }
        
      } catch (e) {}
    })();
  `;
  
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <script dangerouslySetInnerHTML={{ __html: fontScript }} />
      </head>
      <body className={`${inter.variable} ${roboto.variable} ${poppins.variable} font-sans antialiased`}>
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

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CartonFlow',
    description: 'Sistem manajemen produksi kardus karton',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

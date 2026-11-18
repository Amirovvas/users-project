import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fullstack App',
  description: 'Frontend for Express + Prisma backend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

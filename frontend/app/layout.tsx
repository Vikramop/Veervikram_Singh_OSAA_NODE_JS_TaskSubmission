import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Telgram auth App',
  description: 'Created by vik',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

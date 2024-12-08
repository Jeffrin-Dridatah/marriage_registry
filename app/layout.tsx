import './globals.css';
import { Metadata } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import { ReactNode } from 'react';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-cormorant'
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato'
});

export const metadata: Metadata = {
  title: 'Jeff & Rikta',
  description: 'A wedding themed contribution registry'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}

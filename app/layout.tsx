import '../styles/global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from '../lib/apollo-provider';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="page">
        <ApolloWrapper>
          <Link href="/">
            <img src="/logo.png" alt="logo" />
          </Link>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}

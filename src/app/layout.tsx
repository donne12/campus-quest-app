import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang='fr'>
      <head>
         <title>Campus Quest</title>
      </head>
      <body className={inter.className}>
        <main className='w-full h-screen flex flex-col justify-center items-center'>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}

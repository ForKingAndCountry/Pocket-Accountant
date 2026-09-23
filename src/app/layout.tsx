import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CashSense',
  description: 'CashSense API, admin, and Privacy Policy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={dmSans.className}
        style={{
          margin: 0,
          minHeight: '100vh',
          color: '#14241f',
          background:
            'radial-gradient(1200px 600px at 10% -10%, #d8f3eb 0%, transparent 55%), radial-gradient(900px 500px at 100% 0%, #e7f0ec 0%, transparent 50%), #f3f7f5',
        }}
      >
        {children}
      </body>
    </html>
  );
}

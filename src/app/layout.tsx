export const metadata = {
  title: 'Pocket Accountant Admin',
  description: 'Manage users and subscription access',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f4f6f5' }}>
        {children}
      </body>
    </html>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          maxWidth: 420,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ margin: '0 0 8px', color: '#0a5d4e' }}>Pocket Accountant API</h1>
        <p style={{ margin: '0 0 20px', color: '#555', lineHeight: 1.5 }}>
          Backend is running. Mobile app uses <code>/api/auth</code>, <code>/api/sync</code>, and{' '}
          <code>/api/subscription</code>.
        </p>
        <Link
          href="/admin"
          style={{
            display: 'inline-block',
            background: '#0e7c66',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Open admin dashboard →
        </Link>
      </div>
    </main>
  );
}

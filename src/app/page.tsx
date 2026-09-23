import Link from 'next/link';

const endpoints = [
  { path: '/api/auth', label: 'Auth' },
  { path: '/api/sync', label: 'Sync' },
  { path: '/api/subscription', label: 'Subscription' },
  { path: '/api/health', label: 'Health' },
];

export default function HomePage() {
  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.brandRow}>
          <div style={styles.mark}>CS</div>
          <div>
            <div style={styles.brandName}>CashSense</div>
            <div style={styles.brandSub}>Backend console</div>
          </div>
          <span style={styles.statusPill}>
            <span style={styles.statusDot} />
            API online
          </span>
        </div>

        <h1 style={styles.headline}>Your money system, connected.</h1>
        <p style={styles.lede}>
          This server powers the CashSense mobile app — sign-in, offline sync, subscriptions, and
          password resets.
        </p>

        <div style={styles.endpointGrid}>
          {endpoints.map((item) => (
            <div key={item.path} style={styles.endpointCard}>
              <div style={styles.endpointLabel}>{item.label}</div>
              <code style={styles.endpointPath}>{item.path}</code>
            </div>
          ))}
        </div>

        <Link href="/admin" style={styles.cta}>
          Open admin dashboard
          <span aria-hidden style={{ marginLeft: 8 }}>
            →
          </span>
        </Link>

        <p style={styles.footerNote}>
          Secure access only. Use your <code style={styles.inlineCode}>ADMIN_API_KEY</code> to
          manage users and payments.
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
  },
  shell: {
    width: '100%',
    maxWidth: 560,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(14,124,102,0.12)',
    borderRadius: 24,
    padding: '36px 32px 28px',
    boxShadow: '0 24px 60px rgba(10,93,78,0.08)',
    backdropFilter: 'blur(8px)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #0e7c66, #0a5d4e)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 0.5,
  },
  brandName: {
    fontWeight: 800,
    fontSize: 18,
    color: '#0a5d4e',
    lineHeight: 1.1,
  },
  brandSub: {
    fontSize: 12,
    color: '#6b7c76',
    marginTop: 2,
  },
  statusPill: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#e8f6f2',
    color: '#0a5d4e',
    border: '1px solid #b7e4d7',
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#0e7c66',
    display: 'inline-block',
  },
  headline: {
    margin: '0 0 10px',
    fontSize: 32,
    lineHeight: 1.15,
    fontWeight: 800,
    color: '#12201c',
    letterSpacing: '-0.02em',
  },
  lede: {
    margin: '0 0 24px',
    color: '#4d5f58',
    fontSize: 15,
    lineHeight: 1.55,
  },
  endpointGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 28,
  },
  endpointCard: {
    background: '#f7fbf9',
    border: '1px solid #e2eee9',
    borderRadius: 14,
    padding: '12px 14px',
  },
  endpointLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#6b7c76',
    marginBottom: 4,
  },
  endpointPath: {
    fontSize: 13,
    color: '#0a5d4e',
    fontWeight: 600,
  },
  cta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
    background: 'linear-gradient(145deg, #0e7c66, #0a5d4e)',
    color: '#fff',
    padding: '14px 20px',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    boxShadow: '0 10px 24px rgba(14,124,102,0.28)',
  },
  footerNote: {
    margin: '18px 0 0',
    fontSize: 12,
    color: '#6b7c76',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  inlineCode: {
    background: '#eef5f2',
    padding: '1px 6px',
    borderRadius: 6,
    fontSize: 11,
  },
};

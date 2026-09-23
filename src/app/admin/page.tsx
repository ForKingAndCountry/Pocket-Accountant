'use client';

import { useCallback, useEffect, useState } from 'react';

type UserRow = {
  id: string;
  name: string;
  email: string;
  baseCurrency: string;
  subscriptionStatus: string;
  subscriptionEndsAt: string;
  createdAt: string;
  isExpiredByDate: boolean;
};

type Summary = {
  total: number;
  trial: number;
  active: number;
  expired: number;
  grace: number;
  needsAttention: number;
};

const STATUS_COLORS: Record<string, string> = {
  trial: '#1565c0',
  active: '#0e7c66',
  expired: '#c62828',
  grace: '#ef6c00',
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users);
      setSummary(data.summary);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function runAction(userId: string, action: string, days?: number) {
    setBusyId(userId);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, days }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      await loadUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusyId(null);
    }
  }

  async function issueResetCode(email: string) {
    setBusyId(email);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'issue_code' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue code');
      setInfo(
        `Reset code for ${data.email}: ${data.code} (expires in 30 min). Send this on WhatsApp.`
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to issue code');
    } finally {
      setBusyId(null);
    }
  }

  function signOut() {
    setUsers([]);
    setSummary(null);
    setInfo(null);
    void fetch('/api/console/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/privacy';
    });
  }

  return (
    <main style={styles.page}>
      <header style={styles.topBar}>
        <div style={styles.brandRow}>
          <div style={styles.mark}>CS</div>
          <div>
            <div style={styles.brandName}>CashSense Admin</div>
            <div style={styles.brandSub}>Users · subscriptions · support</div>
          </div>
        </div>
        <div style={styles.topActions}>
          <button type="button" onClick={loadUsers} style={styles.secondaryBtn} disabled={loading}>
            Refresh
          </button>
          <button type="button" onClick={signOut} style={styles.secondaryBtn}>
            Sign out
          </button>
        </div>
      </header>

      <section style={styles.intro}>
        <h1 style={styles.pageTitle}>Subscription desk</h1>
        <p style={styles.pageLede}>
          Approve payments to unlock the app. Issue password reset codes for WhatsApp support.
        </p>
      </section>

      {summary && (
        <div style={styles.statsRow}>
          <Stat label="Total" value={summary.total} />
          <Stat label="Trial" value={summary.trial} color="#1565c0" />
          <Stat label="Active" value={summary.active} color="#0e7c66" />
          <Stat label="Expired" value={summary.expired} color="#c62828" />
          <Stat label="Attention" value={summary.needsAttention} color="#ef6c00" />
        </div>
      )}

      <div style={styles.toolbar}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="all">All statuses</option>
          <option value="trial">Trial</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="grace">Grace</option>
        </select>
        <input
          type="search"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, flex: 1, marginBottom: 0 }}
        />
        <button type="button" onClick={loadUsers} style={styles.primaryBtn}>
          Search
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {info && <div style={styles.info}>{info}</div>}
      {loading && <p style={{ color: '#6b7c76' }}>Loading…</p>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Access until</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #e8efec' }}>
                <td style={styles.td}>
                  <strong style={{ color: '#12201c' }}>{u.name}</strong>
                  <br />
                  <span style={{ fontSize: 13, color: '#6b7c76' }}>{u.email}</span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: (STATUS_COLORS[u.subscriptionStatus] ?? '#666') + '18',
                      color: STATUS_COLORS[u.subscriptionStatus] ?? '#666',
                    }}
                  >
                    {u.subscriptionStatus}
                    {u.isExpiredByDate && u.subscriptionStatus !== 'expired' ? ' (past date)' : ''}
                  </span>
                </td>
                <td style={styles.td}>
                  {u.subscriptionEndsAt
                    ? new Date(u.subscriptionEndsAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })
                    : '—'}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <ActionBtn
                      label="Approve 1y"
                      color="#0e7c66"
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'approve', 365)}
                    />
                    <ActionBtn
                      label="Extend 1y"
                      color="#1565c0"
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'extend', 365)}
                    />
                    <ActionBtn
                      label="Approve 30d"
                      color="#0e7c66"
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'approve', 30)}
                    />
                    <ActionBtn
                      label="Extend 30d"
                      color="#1565c0"
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'extend', 30)}
                    />
                    <ActionBtn
                      label="Grace 7d"
                      color="#ef6c00"
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'grace', 7)}
                    />
                    <ActionBtn
                      label="Deny"
                      color="#c62828"
                      disabled={busyId === u.id || busyId === u.email}
                      onClick={() => runAction(u.id, 'deny')}
                    />
                    <ActionBtn
                      label="Reset code"
                      color="#5e35b1"
                      disabled={busyId === u.id || busyId === u.email}
                      onClick={() => issueResetCode(u.email)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <p style={{ padding: 28, textAlign: 'center', color: '#6b7c76' }}>No users found.</p>
        )}
      </div>

      <section style={styles.helpCard}>
        <h2 style={{ margin: '0 0 10px', fontSize: 16, color: '#0a5d4e' }}>Quick guide</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#4d5f58', lineHeight: 1.65, fontSize: 14 }}>
          <li>
            <strong>Approve 1y</strong> — mark paid; active for 365 days (yearly plan).
          </li>
          <li>
            <strong>Extend 1y</strong> — add 365 days from the current end date (or today if expired).
          </li>
          <li>
            <strong>Approve / Extend 30d</strong> — short trial or prorated access.
          </li>
          <li>
            <strong>Grace</strong> — temporary access for 7 days.
          </li>
          <li>
            <strong>Deny</strong> — expire access (view-only in the app).
          </li>
          <li>
            <strong>Reset code</strong> — 6-digit code for WhatsApp (30 minutes).
          </li>
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value, color = '#12201c' }: { label: string; value: number; color?: string }) {
  return (
    <div style={styles.stat}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6b7c76', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ActionBtn({
  label,
  color,
  onClick,
  disabled,
}: {
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${color}`,
        background: '#fff',
        color,
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'wait' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1120, margin: '0 auto', padding: '28px 20px 56px' },
  authPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  authCard: {
    width: '100%',
    maxWidth: 440,
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(14,124,102,0.12)',
    borderRadius: 24,
    padding: '32px 28px 24px',
    boxShadow: '0 24px 60px rgba(10,93,78,0.08)',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 12 },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #0e7c66, #0a5d4e)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontWeight: 800, fontSize: 17, color: '#0a5d4e', lineHeight: 1.1 },
  brandSub: { fontSize: 12, color: '#6b7c76', marginTop: 2 },
  authTitle: {
    margin: '28px 0 8px',
    fontSize: 28,
    fontWeight: 800,
    color: '#12201c',
    letterSpacing: '-0.02em',
  },
  authSubtitle: { margin: '0 0 22px', color: '#4d5f58', lineHeight: 1.55, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0a5d4e',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.88)',
    border: '1px solid rgba(14,124,102,0.1)',
    borderRadius: 18,
    padding: '14px 16px',
  },
  topActions: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  intro: { marginBottom: 18 },
  pageTitle: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    color: '#12201c',
    letterSpacing: '-0.02em',
  },
  pageLede: { margin: '8px 0 0', color: '#4d5f58', fontSize: 15 },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    marginBottom: 18,
  },
  stat: {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 16,
    border: '1px solid #e2eee9',
  },
  toolbar: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  input: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: 12,
    border: '1px solid #d5e3dd',
    fontSize: 15,
    marginBottom: 14,
    boxSizing: 'border-box',
    background: '#fff',
    outline: 'none',
  },
  select: {
    padding: '12px 12px',
    borderRadius: 12,
    border: '1px solid #d5e3dd',
    fontSize: 14,
    background: '#fff',
  },
  primaryBtn: {
    background: 'linear-gradient(145deg, #0e7c66, #0a5d4e)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 18px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primaryBtnFull: {
    background: 'linear-gradient(145deg, #0e7c66, #0a5d4e)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 10px 24px rgba(14,124,102,0.25)',
  },
  secondaryBtn: {
    background: '#fff',
    color: '#234039',
    border: '1px solid #d5e3dd',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  backLink: {
    display: 'block',
    marginTop: 18,
    textAlign: 'center',
    color: '#0a5d4e',
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
  },
  ghostLink: {
    color: '#0a5d4e',
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    padding: '8px 4px',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  info: {
    background: '#e8f6f2',
    color: '#0a5d4e',
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid #b7e4d7',
  },
  tableWrap: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid #e2eee9',
    boxShadow: '0 12px 32px rgba(10,93,78,0.05)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7c76',
    background: '#f7fbf9',
  },
  td: { padding: '14px 16px', verticalAlign: 'top' },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  helpCard: {
    marginTop: 22,
    background: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 22,
    border: '1px solid #e2eee9',
  },
};

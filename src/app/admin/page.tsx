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
  const [adminKey, setAdminKey] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('pa_admin_key');
    if (saved) setStoredKey(saved);
  }, []);

  const loadUsers = useCallback(async () => {
    const key = storedKey;
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { 'X-Admin-Key': key },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users);
      setSummary(data.summary);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      if (e instanceof Error && e.message.includes('Unauthorized')) {
        sessionStorage.removeItem('pa_admin_key');
        setStoredKey(null);
      }
    } finally {
      setLoading(false);
    }
  }, [storedKey, filter, search]);

  useEffect(() => {
    if (storedKey) loadUsers();
  }, [storedKey, loadUsers]);

  async function runAction(userId: string, action: string, days?: number) {
    if (!storedKey) return;
    setBusyId(userId);
    setError(null);
    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': storedKey,
        },
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

  function saveKey(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem('pa_admin_key', adminKey.trim());
    setStoredKey(adminKey.trim());
    setAdminKey('');
  }

  function signOut() {
    sessionStorage.removeItem('pa_admin_key');
    setStoredKey(null);
    setUsers([]);
    setSummary(null);
  }

  if (!storedKey) {
    return (
      <main style={styles.centered}>
        <div style={styles.card}>
          <h1 style={styles.title}>Admin sign-in</h1>
          <p style={styles.subtitle}>
            Enter your <strong>ADMIN_API_KEY</strong> from the server <code>.env</code> file.
          </p>
          <form onSubmit={saveKey}>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin API key"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.primaryBtn}>
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, color: '#0a5d4e' }}>User & subscription admin</h1>
          <p style={{ margin: '6px 0 0', color: '#666', fontSize: 14 }}>
            Approve payments to grant app access. Deny or expire to soft-lock the mobile app.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={loadUsers} style={styles.secondaryBtn} disabled={loading}>
            Refresh
          </button>
          <button type="button" onClick={signOut} style={styles.secondaryBtn}>
            Sign out
          </button>
        </div>
      </header>

      {summary && (
        <div style={styles.statsRow}>
          <Stat label="Total" value={summary.total} />
          <Stat label="Trial" value={summary.trial} color="#1565c0" />
          <Stat label="Active" value={summary.active} color="#0e7c66" />
          <Stat label="Expired" value={summary.expired} color="#c62828" />
          <Stat label="Needs attention" value={summary.needsAttention} color="#ef6c00" />
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
      {loading && <p style={{ color: '#666' }}>Loading…</p>}

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
              <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={styles.td}>
                  <strong>{u.name}</strong>
                  <br />
                  <span style={{ fontSize: 13, color: '#666' }}>{u.email}</span>
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
                      disabled={busyId === u.id}
                      onClick={() => runAction(u.id, 'deny')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <p style={{ padding: 24, textAlign: 'center', color: '#666' }}>No users found.</p>
        )}
      </div>

      <section style={{ ...styles.card, marginTop: 24 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>How this works</h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#555', lineHeight: 1.6, fontSize: 14 }}>
          <li>
            <strong>Approve</strong> — user paid; set status to <em>active</em> for 30 days (full app access).
          </li>
          <li>
            <strong>Extend</strong> — add 30 days to an existing active subscription.
          </li>
          <li>
            <strong>Grace</strong> — temporary access (offline-friendly) for 7 days.
          </li>
          <li>
            <strong>Deny</strong> — set <em>expired</em>; mobile app soft-locks (view only, no edits).
          </li>
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value, color = '#333' }: { label: string; value: number; color?: string }) {
  return (
    <div style={styles.stat}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
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
  page: { maxWidth: 1100, margin: '0 auto', padding: '24px 20px 48px' },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  title: { margin: '0 0 8px', color: '#0a5d4e' },
  subtitle: { margin: '0 0 20px', color: '#555', lineHeight: 1.5, fontSize: 14 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  toolbar: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 15,
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 14,
  },
  primaryBtn: {
    background: '#0e7c66',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 18px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryBtn: {
    background: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  tableWrap: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#888',
    background: '#fafafa',
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
};

'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

/**
 * Hidden staff entry point. Not linked from public pages.
 * Visit /console, enter your access key, then you can open /admin.
 */
export default function ConsoleGatePage() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/console/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: accessKey.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Access denied');
      }
      router.replace('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Access denied');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={onSubmit} style={styles.card}>
        <div style={styles.mark}>CS</div>
        <h1 style={styles.title}>Staff access</h1>
        <p style={styles.sub}>Enter your access key to continue.</p>
        <label htmlFor="access-key" style={styles.label}>
          Access key
        </label>
        <input
          id="access-key"
          type="password"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
          required
          minLength={8}
        />
        {error ? <p style={styles.error}>{error}</p> : null}
        <button type="submit" style={styles.btn} disabled={busy}>
          {busy ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(43,58,103,0.12)',
    borderRadius: 20,
    padding: '32px 28px',
    boxShadow: '0 18px 40px rgba(30,42,77,0.1)',
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #2B3A67, #1E2A4D)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 15,
    marginBottom: 18,
  },
  title: {
    margin: '0 0 8px',
    fontSize: 24,
    fontWeight: 800,
    color: '#1A1F2E',
  },
  sub: {
    margin: '0 0 20px',
    color: '#5C6478',
    fontSize: 14,
    lineHeight: 1.45,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#2B3A67',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #E4E2DC',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    margin: '0 0 12px',
    color: '#B42318',
    fontSize: 13,
  },
  btn: {
    width: '100%',
    border: 'none',
    borderRadius: 12,
    padding: '13px 16px',
    background: 'linear-gradient(145deg, #2B3A67, #1E2A4D)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
};

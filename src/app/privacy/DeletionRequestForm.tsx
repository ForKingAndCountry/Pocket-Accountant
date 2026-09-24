'use client';

import { FormEvent, useMemo, useState } from 'react';

const PRIVACY_EMAIL = 'obiaws96@gmail.com';

type RequestKind = 'account' | 'data';

export function DeletionRequestForm() {
  const [kind, setKind] = useState<RequestKind>('account');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const mailHref = useMemo(() => {
    const subject =
      kind === 'account'
        ? 'CashSense account deletion request'
        : 'CashSense data deletion request';

    const lines = [
      'Hello CashSense Privacy Support,',
      '',
      kind === 'account'
        ? 'I would like to request deletion of my CashSense account and associated personal information.'
        : 'I would like to request deletion of my personal data held by CashSense (without necessarily closing the account, unless required).',
      '',
      `Request type: ${kind === 'account' ? 'Account deletion' : 'Data deletion'}`,
      `CashSense account email: ${email.trim() || '(please fill in)'}`,
      name.trim() ? `Name: ${name.trim()}` : null,
      notes.trim() ? `Additional details: ${notes.trim()}` : null,
      '',
      'Please confirm when this request has been processed.',
      '',
      'Thank you.',
    ].filter((line) => line !== null);

    const params = new URLSearchParams({
      subject,
      body: lines.join('\n'),
    });

    return `mailto:${PRIVACY_EMAIL}?${params.toString()}`;
  }, [kind, email, name, notes]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter the email address used for your CashSense account.');
      return;
    }
    window.location.href = mailHref;
  }

  return (
    <form id="delete-request" onSubmit={onSubmit} style={styles.card}>
      <h3 style={styles.title}>Request deletion</h3>
      <p style={styles.help}>
        Choose what you want removed, then send an email to{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} style={styles.link}>
          {PRIVACY_EMAIL}
        </a>
        . We may need to verify you own the account before completing the request.
      </p>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>What do you want to request?</legend>
        <label style={styles.radioRow}>
          <input
            type="radio"
            name="kind"
            value="account"
            checked={kind === 'account'}
            onChange={() => setKind('account')}
          />
          <span>
            <strong>Delete my account</strong>
            <span style={styles.radioHint}>Close the account and remove associated personal information.</span>
          </span>
        </label>
        <label style={styles.radioRow}>
          <input
            type="radio"
            name="kind"
            value="data"
            checked={kind === 'data'}
            onChange={() => setKind('data')}
          />
          <span>
            <strong>Delete my data</strong>
            <span style={styles.radioHint}>Remove stored personal/financial data tied to my account.</span>
          </span>
        </label>
      </fieldset>

      <label style={styles.label} htmlFor="delete-email">
        CashSense account email
      </label>
      <input
        id="delete-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={styles.input}
        autoComplete="email"
      />

      <label style={styles.label} htmlFor="delete-name">
        Name (optional)
      </label>
      <input
        id="delete-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={styles.input}
        autoComplete="name"
      />

      <label style={styles.label} htmlFor="delete-notes">
        Additional details (optional)
      </label>
      <textarea
        id="delete-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anything that helps us find your account"
        style={{ ...styles.input, minHeight: 88, resize: 'vertical' as const }}
        rows={3}
      />

      <a href={mailHref} style={styles.button} onClick={(e) => {
        if (!email.trim() || !email.includes('@')) {
          e.preventDefault();
          alert('Please enter the email address used for your CashSense account.');
        }
      }}>
        Open email to request deletion
      </a>
      <p style={styles.footnote}>
        This opens your email app with a message ready to send. If nothing opens, write to{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} style={styles.link}>
          {PRIVACY_EMAIL}
        </a>{' '}
        and include your account email plus whether you want account or data deletion.
      </p>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    marginTop: 18,
    padding: 18,
    borderRadius: 16,
    background: '#F7F8FC',
    border: '1px solid #E4E2DC',
  },
  title: {
    margin: '0 0 8px',
    fontSize: 17,
    fontWeight: 800,
    color: '#2B3A67',
  },
  help: {
    margin: '0 0 16px',
    fontSize: 14,
    lineHeight: 1.55,
    color: '#5C6478',
  },
  fieldset: {
    border: 'none',
    margin: '0 0 14px',
    padding: 0,
  },
  legend: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2B3A67',
    marginBottom: 10,
  },
  radioRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
    fontSize: 14,
    color: '#1A1F2E',
    cursor: 'pointer',
  },
  radioHint: {
    display: 'block',
    marginTop: 2,
    fontSize: 12,
    color: '#5C6478',
    fontWeight: 400,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 700,
    color: '#2B3A67',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #E4E2DC',
    borderRadius: 12,
    padding: '11px 12px',
    fontSize: 15,
    marginBottom: 12,
    background: '#fff',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 4,
    padding: '13px 16px',
    borderRadius: 12,
    background: 'linear-gradient(145deg, #2B3A67, #1E2A4D)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
  footnote: {
    margin: '12px 0 0',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#5C6478',
  },
  link: {
    color: '#0E7C66',
    fontWeight: 600,
  },
};

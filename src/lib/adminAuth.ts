import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, expectedAdminSessionToken } from '@/lib/adminSession';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export async function verifyAdminRequest(request: Request): Promise<NextResponse | null> {
  if (!ADMIN_API_KEY || ADMIN_API_KEY.length < 8) {
    return NextResponse.json({ error: 'Admin API is not configured' }, { status: 503 });
  }

  const headerKey = request.headers.get('X-Admin-Key')?.trim();
  const authHeader = request.headers.get('Authorization');
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const provided = headerKey || bearerKey;

  if (provided && provided === ADMIN_API_KEY.trim()) {
    return null;
  }

  // Same-origin staff console: httpOnly session cookie set at /console
  const cookies = parseCookieHeader(request.headers.get('cookie'));
  const session = cookies[ADMIN_SESSION_COOKIE];
  const expected = await expectedAdminSessionToken();
  if (session && expected && session === expected) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function addSubscriptionDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

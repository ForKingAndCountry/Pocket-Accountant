import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminGateSecret,
  expectedAdminSessionToken,
} from '@/lib/adminSession';

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * POST /api/console/login
 * Body: { accessKey: string }
 * Sets an httpOnly staff session cookie when the key matches.
 */
export async function POST(request: Request) {
  try {
    const secret = adminGateSecret();
    if (!secret) {
      return NextResponse.json({ error: 'Staff access is not configured' }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const accessKey = typeof body.accessKey === 'string' ? body.accessKey.trim() : '';

    if (!accessKey || !safeEqual(accessKey, secret)) {
      return NextResponse.json({ error: 'Invalid access key' }, { status: 401 });
    }

    const token = await expectedAdminSessionToken();
    if (!token) {
      return NextResponse.json({ error: 'Staff access is not configured' }, { status: 503 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 500 });
  }
}

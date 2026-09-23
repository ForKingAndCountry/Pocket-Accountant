import { NextResponse } from 'next/server';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export function verifyAdminRequest(request: Request): NextResponse | null {
  if (!ADMIN_API_KEY || ADMIN_API_KEY.length < 8) {
    return NextResponse.json(
      { error: 'Admin API is not configured. Set ADMIN_API_KEY in .env' },
      { status: 503 }
    );
  }

  const headerKey = request.headers.get('X-Admin-Key')?.trim();
  const authHeader = request.headers.get('Authorization');
  const bearerKey =
    authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  const provided = headerKey || bearerKey;
  if (!provided || provided !== ADMIN_API_KEY.trim()) {
    return NextResponse.json(
      { error: 'Unauthorized — check ADMIN_API_KEY in backend/.env' },
      { status: 401 }
    );
  }

  return null;
}

export function addSubscriptionDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

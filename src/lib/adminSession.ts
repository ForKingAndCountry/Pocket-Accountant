export const ADMIN_SESSION_COOKIE = 'cs_staff_session';

/** Secret used for the staff console gate (falls back to ADMIN_API_KEY). */
export function adminGateSecret(): string | null {
  const dedicated = process.env.ADMIN_DASHBOARD_SECRET?.trim();
  if (dedicated && dedicated.length >= 8) return dedicated;
  const apiKey = process.env.ADMIN_API_KEY?.trim();
  if (apiKey && apiKey.length >= 8) return apiKey;
  return null;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Deterministic session token derived from secrets — compared in middleware. */
export async function expectedAdminSessionToken(): Promise<string | null> {
  const gate = adminGateSecret();
  const pepper = process.env.JWT_SECRET?.trim() || 'cashsense-staff';
  if (!gate) return null;
  return sha256Hex(`cs-staff|${gate}|${pepper}`);
}

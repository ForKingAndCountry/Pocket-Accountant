import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/** 6-digit numeric code as a string (e.g. "048291"). */
export function generateResetCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export async function hashResetCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyResetCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/** Default 30 minutes so WhatsApp handoff has enough time. */
export function resetExpiryDate(minutes = 30): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

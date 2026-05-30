/**
 * Test Atlas credentials without starting Next.js.
 * Usage (from backend/): node scripts/test-mongo.mjs
 */
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env');
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env optional if MONGODB_URI already set
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

// Print host only (never log password)
const hostMatch = uri.match(/@([^/?]+)/);
console.log('Connecting to:', hostMatch?.[1] ?? '(unknown host)');

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('OK — MongoDB connected');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('FAILED —', err.message);
  console.error('\nFix in MongoDB Atlas:');
  console.error('  1. Database Access → confirm user exists (e.g. appuser)');
  console.error('  2. Edit user → Reset password (use letters+numbers only to avoid encoding)');
  console.error('  3. Network Access → allow your IP (or 0.0.0.0/0 for dev)');
  console.error('  4. Connect → Drivers → copy URI, replace password, add /pocket_accountant');
  process.exit(1);
}

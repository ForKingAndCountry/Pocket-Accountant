import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyResetCode } from '@/lib/passwordReset';

/**
 * POST /api/auth/reset-password
 * Body: { email, code, newPassword }
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, reset code, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Reset code must be 6 digits' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordResetCodeHash || !user.passwordResetExpires) {
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    if (user.passwordResetExpires.getTime() < Date.now()) {
      user.passwordResetCodeHash = null;
      user.passwordResetExpires = null;
      await user.save();
      return NextResponse.json(
        { error: 'Reset code has expired. Request a new one.' },
        { status: 400 }
      );
    }

    const ok = await verifyResetCode(code, user.passwordResetCodeHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordResetCodeHash = null;
    user.passwordResetExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated. You can sign in with your new password.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Reset password error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

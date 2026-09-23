import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { generateResetCode, hashResetCode, resetExpiryDate } from '@/lib/passwordReset';

/**
 * POST /api/admin/reset-password
 * Headers: X-Admin-Key
 * Body:
 *   { email, action: 'issue_code' }  → creates a new 6-digit code (returned once for WhatsApp support)
 *   { email, action: 'set_password', newPassword } → directly sets a new password
 */
export async function POST(request: Request) {
  const denied = verifyAdminRequest(request);
  if (denied) return denied;

  try {
    await dbConnect();
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const action = typeof body.action === 'string' ? body.action : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'issue_code') {
      const code = generateResetCode();
      user.passwordResetCodeHash = await hashResetCode(code);
      user.passwordResetExpires = resetExpiryDate();
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Reset code issued. Share it with the user via WhatsApp (expires in 30 minutes).',
        code,
        email: user.email,
        name: user.name,
        expiresAt: user.passwordResetExpires,
      });
    }

    if (action === 'set_password') {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordResetCodeHash = null;
      user.passwordResetExpires = null;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Password updated for user.',
        email: user.email,
      });
    }

    return NextResponse.json(
      { error: 'action must be issue_code or set_password' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin reset password error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail, isMailConfigured } from '@/lib/mail';
import { generateResetCode, hashResetCode, resetExpiryDate } from '@/lib/passwordReset';

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 *
 * Always returns a generic success message (does not reveal whether the email exists).
 * When SMTP is configured, emails a 6-digit code that expires in 15 minutes.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const genericMessage =
      'If an account exists for that email, a reset code has been sent. Check your inbox.';

    const user = await User.findOne({ email });
    if (!user) {
      // Same response shape — avoid account enumeration.
      return NextResponse.json({
        success: true,
        message: genericMessage,
        emailSent: false,
      });
    }

    const code = generateResetCode();
    user.passwordResetCodeHash = await hashResetCode(code);
    user.passwordResetExpires = resetExpiryDate(15);
    await user.save();

    let emailSent = false;
    if (isMailConfigured()) {
      const result = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        code,
      });
      emailSent = result.sent;
    } else {
      // Dev / pre-SMTP: log so you can test without mail.
      console.info(`[forgot-password] Reset code for ${user.email}: ${code} (expires in 15m)`);
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? genericMessage
        : 'If an account exists, a reset code was created. ' +
          (isMailConfigured()
            ? 'Email delivery failed — contact support on WhatsApp.'
            : 'Email is not configured on the server yet — ask support for your code, or check server logs in development.'),
      emailSent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Forgot password error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

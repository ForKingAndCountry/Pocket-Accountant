import nodemailer from 'nodemailer';

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  code: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isMailConfigured()) {
    return { sent: false, error: 'SMTP is not configured' };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: params.to,
      subject: 'CashSense password reset code',
      text: [
        `Hello ${params.name || 'there'},`,
        '',
        `Your CashSense password reset code is: ${params.code}`,
        '',
        'This code expires in 30 minutes.',
        'If you did not request a reset, you can ignore this email.',
        '',
        '— CashSense Support',
      ].join('\n'),
      html: `
        <p>Hello ${params.name || 'there'},</p>
        <p>Your CashSense password reset code is:</p>
        <p style="font-size:28px;font-weight:800;letter-spacing:4px;">${params.code}</p>
        <p>This code expires in <strong>30 minutes</strong>.</p>
        <p>If you did not request a reset, you can ignore this email.</p>
        <p>— CashSense Support</p>
      `,
    });
    return { sent: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send email';
    console.error('Password reset email failed:', message);
    return { sent: false, error: message };
  }
}

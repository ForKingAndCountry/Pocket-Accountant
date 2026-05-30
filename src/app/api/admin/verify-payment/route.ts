import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { addSubscriptionDays, verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const denied = verifyAdminRequest(request);
  if (denied) return denied;

  try {
    await dbConnect();
    const body = await request.json();
    const { userId, action, days } = body as {
      userId?: string;
      action?: string;
      days?: number;
    };

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const extensionDays = typeof days === 'number' && days > 0 ? days : 30;

    switch (action) {
      case 'approve':
        user.subscriptionStatus = 'active';
        user.subscriptionEndsAt = addSubscriptionDays(new Date(), extensionDays);
        break;
      case 'deny':
        user.subscriptionStatus = 'expired';
        break;
      case 'grace':
        user.subscriptionStatus = 'grace';
        user.subscriptionEndsAt = addSubscriptionDays(new Date(), extensionDays);
        break;
      case 'extend':
        user.subscriptionStatus = 'active';
        user.subscriptionEndsAt = addSubscriptionDays(
          user.subscriptionEndsAt > new Date() ? user.subscriptionEndsAt : new Date(),
          extensionDays
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use approve, deny, grace, or extend' },
          { status: 400 }
        );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndsAt: user.subscriptionEndsAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Verification failed: ' + message }, { status: 500 });
  }
}

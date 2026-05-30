import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User, { type IUser } from '@/models/User';
import { verifyAdminRequest } from '@/lib/adminAuth';

type UserLean = IUser & { _id: mongoose.Types.ObjectId };

export async function GET(request: Request) {
  const denied = verifyAdminRequest(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q')?.trim().toLowerCase();

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') {
      filter.subscriptionStatus = status;
    }

    let users: UserLean[] = await User.find(filter)
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean<UserLean[]>();
    if (q) {
      users = users.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q)
      );
    }

    const now = new Date();
    const summary = {
      total: users.length,
      trial: users.filter((u) => u.subscriptionStatus === 'trial').length,
      active: users.filter((u) => u.subscriptionStatus === 'active').length,
      expired: users.filter((u) => u.subscriptionStatus === 'expired').length,
      grace: users.filter((u) => u.subscriptionStatus === 'grace').length,
      needsAttention: users.filter(
        (u) =>
          u.subscriptionStatus === 'expired' ||
          (u.subscriptionEndsAt && new Date(u.subscriptionEndsAt) < now)
      ).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        baseCurrency: u.baseCurrency,
        subscriptionStatus: u.subscriptionStatus,
        subscriptionEndsAt: u.subscriptionEndsAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        isExpiredByDate: u.subscriptionEndsAt ? new Date(u.subscriptionEndsAt) < now : false,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';

interface DecodedToken {
  userId: string;
  email: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Authenticate Request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or malformed Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { userId } = decoded;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (new Date() > user.subscriptionEndsAt && user.subscriptionStatus !== 'expired') {
      user.subscriptionStatus = 'expired';
      await user.save();
    }

    return NextResponse.json({
      success: true,
      subscription: {
        status: user.subscriptionStatus,
        endsAt: user.subscriptionEndsAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Subscription Status GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve subscription status' }, { status: 500 });
  }
}

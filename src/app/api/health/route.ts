import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const state = mongoose.connection.readyState;
    return NextResponse.json({
      ok: true,
      mongodb: state === 1 ? 'connected' : 'connecting',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

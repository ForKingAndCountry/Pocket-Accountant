import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Debt from '@/models/Debt';
import Device from '@/models/Device';
import Wallet from '@/models/Wallet';
import Buffer from '@/models/Buffer';
import AllocationPlan from '@/models/AllocationPlan';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';

interface DecodedToken {
  userId: string;
  email: string;
}

function parseClientDate(value: unknown, fallbackMs?: number): Date {
  if (typeof value === 'string') return new Date(value);
  if (typeof value === 'number') return new Date(value);
  if (fallbackMs != null) return new Date(fallbackMs);
  return new Date();
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or malformed Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch {
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

    const body = await request.json();
    const {
      deviceId,
      lastSyncAt,
      transactions: clientTransactions,
      debts: clientDebts,
      wallets: clientWallets,
      buffers: clientBuffers,
      allocationPlans: clientAllocationPlans,
      appVersion,
    } = body;

    const lastSyncDate = lastSyncAt ? new Date(lastSyncAt) : new Date(0);
    const syncStartTime = new Date();

    if (deviceId) {
      await Device.findOneAndUpdate(
        { deviceId },
        {
          userId,
          lastSeenAt: new Date(),
          lastSyncAt: syncStartTime,
          appVersion: appVersion || '1.0.0',
        },
        { upsert: true }
      );
    }

    // Wallets first (referenced by transactions)
    if (Array.isArray(clientWallets)) {
      for (const w of clientWallets) {
        const existing = await Wallet.findOne({ _id: w.id, userId });
        const clientUpdatedAt = parseClientDate(w.updatedAt ?? w.updated_at, w.updatedAtMs ?? w.updated_at);

        if (!existing) {
          await Wallet.create({
            _id: w.id,
            userId,
            name: w.name || 'Wallet',
            currency: w.currency || 'LRD',
            deleted: w.deleted || false,
            createdAt: parseClientDate(w.createdAt ?? w.created_at, w.createdAtMs ?? w.created_at),
            updatedAt: clientUpdatedAt,
            serverUpdatedAt: syncStartTime,
          });
        } else if (clientUpdatedAt > existing.updatedAt) {
          existing.name = w.name || existing.name;
          existing.currency = w.currency || existing.currency;
          existing.deleted = w.deleted || false;
          existing.updatedAt = clientUpdatedAt;
          existing.serverUpdatedAt = syncStartTime;
          await existing.save();
        }
      }
    }

    if (Array.isArray(clientTransactions)) {
      for (const tx of clientTransactions) {
        const existingTx = await Transaction.findOne({ _id: tx.id, userId });
        const clientUpdatedAt = parseClientDate(tx.updatedAt ?? tx.updated_at, tx.updatedAtMs ?? tx.updated_at);

        if (!existingTx) {
          await Transaction.create({
            _id: tx.id,
            userId,
            type: tx.type,
            amount: tx.amount,
            currency: tx.currency,
            category: tx.category,
            note: tx.note || '',
            exchangeRate: tx.exchangeRate || tx.exchange_rate || 1.0,
            accountId: tx.walletId || tx.wallet_id || tx.accountId || '',
            deviceId: deviceId || '',
            deleted: tx.deleted || tx.isDeleted || false,
            createdAt: parseClientDate(tx.createdAt ?? tx.created_at, tx.createdAtMs ?? tx.created_at),
            updatedAt: clientUpdatedAt,
            serverUpdatedAt: syncStartTime,
          });
        } else if (clientUpdatedAt > existingTx.updatedAt) {
          existingTx.type = tx.type;
          existingTx.amount = tx.amount;
          existingTx.currency = tx.currency;
          existingTx.category = tx.category;
          existingTx.note = tx.note || '';
          existingTx.exchangeRate = tx.exchangeRate || tx.exchange_rate || 1.0;
          existingTx.accountId = tx.walletId || tx.wallet_id || tx.accountId || '';
          existingTx.deleted = tx.deleted || tx.isDeleted || false;
          existingTx.updatedAt = clientUpdatedAt;
          existingTx.serverUpdatedAt = syncStartTime;
          await existingTx.save();
        }
      }
    }

    if (Array.isArray(clientDebts)) {
      for (const d of clientDebts) {
        const existingDebt = await Debt.findOne({ _id: d.id, userId });
        const clientUpdatedAt = parseClientDate(d.updatedAt ?? d.updated_at, d.updatedAtMs ?? d.updated_at);

        if (!existingDebt) {
          await Debt.create({
            _id: d.id,
            userId,
            person: d.person || d.personName || d.person_name || '',
            amount: d.amount,
            currency: d.currency,
            status: d.status || 'pending',
            deleted: d.deleted || false,
            createdAt: parseClientDate(d.createdAt ?? d.created_at, d.createdAtMs ?? d.created_at),
            updatedAt: clientUpdatedAt,
          });
        } else if (clientUpdatedAt > existingDebt.updatedAt) {
          existingDebt.person = d.person || d.personName || d.person_name || '';
          existingDebt.amount = d.amount;
          existingDebt.currency = d.currency;
          existingDebt.status = d.status || 'pending';
          existingDebt.deleted = d.deleted || false;
          existingDebt.updatedAt = clientUpdatedAt;
          await existingDebt.save();
        }
      }
    }

    if (Array.isArray(clientBuffers)) {
      for (const b of clientBuffers) {
        const existing = await Buffer.findOne({ _id: b.id, userId });
        const clientUpdatedAt = parseClientDate(b.updatedAt ?? b.updated_at, b.updatedAtMs ?? b.updated_at);

        if (!existing) {
          await Buffer.create({
            _id: b.id,
            userId,
            name: b.name || 'Buffer',
            purpose: b.purpose || '',
            annualEstimate: b.annualEstimate ?? b.annual_estimate ?? 0,
            currentBalance: b.currentBalance ?? b.current_balance ?? 0,
            currency: b.currency || 'LRD',
            deleted: b.deleted || false,
            createdAt: parseClientDate(b.createdAt ?? b.created_at, b.createdAtMs ?? b.created_at),
            updatedAt: clientUpdatedAt,
            serverUpdatedAt: syncStartTime,
          });
        } else if (clientUpdatedAt > existing.updatedAt) {
          existing.name = b.name || existing.name;
          existing.purpose = b.purpose || '';
          existing.annualEstimate = b.annualEstimate ?? b.annual_estimate ?? existing.annualEstimate;
          existing.currentBalance = b.currentBalance ?? b.current_balance ?? existing.currentBalance;
          existing.currency = b.currency || existing.currency;
          existing.deleted = b.deleted || false;
          existing.updatedAt = clientUpdatedAt;
          existing.serverUpdatedAt = syncStartTime;
          await existing.save();
        }
      }
    }

    if (Array.isArray(clientAllocationPlans)) {
      for (const p of clientAllocationPlans) {
        const existing = await AllocationPlan.findOne({ _id: p.id, userId });
        const clientUpdatedAt = parseClientDate(p.updatedAt ?? p.updated_at, p.updatedAtMs ?? p.updated_at);

        if (!existing) {
          await AllocationPlan.create({
            _id: p.id,
            userId,
            name: p.name || 'Default Plan',
            isDefault: p.isDefault ?? p.is_default ?? true,
            percentSavings: p.percentSavings ?? p.percent_savings ?? 10,
            percentDebt: p.percentDebt ?? p.percent_debt ?? 20,
            percentInvestment: p.percentInvestment ?? p.percent_investment ?? 10,
            percentGuiltFree: p.percentGuiltFree ?? p.percent_guilt_free ?? 60,
            deleted: p.deleted || false,
            createdAt: parseClientDate(p.createdAt ?? p.created_at, p.createdAtMs ?? p.created_at),
            updatedAt: clientUpdatedAt,
            serverUpdatedAt: syncStartTime,
          });
        } else if (clientUpdatedAt > existing.updatedAt) {
          existing.name = p.name || existing.name;
          existing.isDefault = p.isDefault ?? p.is_default ?? existing.isDefault;
          existing.percentSavings = p.percentSavings ?? p.percent_savings ?? existing.percentSavings;
          existing.percentDebt = p.percentDebt ?? p.percent_debt ?? existing.percentDebt;
          existing.percentInvestment = p.percentInvestment ?? p.percent_investment ?? existing.percentInvestment;
          existing.percentGuiltFree = p.percentGuiltFree ?? p.percent_guilt_free ?? existing.percentGuiltFree;
          existing.deleted = p.deleted || false;
          existing.updatedAt = clientUpdatedAt;
          existing.serverUpdatedAt = syncStartTime;
          await existing.save();
        }
      }
    }

    const serverTransactions = await Transaction.find({
      userId,
      serverUpdatedAt: { $gt: lastSyncDate },
    });

    const serverDebts = await Debt.find({
      userId,
      updatedAt: { $gt: lastSyncDate },
    });

    const serverWallets = await Wallet.find({
      userId,
      serverUpdatedAt: { $gt: lastSyncDate },
    });

    const serverBuffers = await Buffer.find({
      userId,
      serverUpdatedAt: { $gt: lastSyncDate },
    });

    const serverAllocationPlans = await AllocationPlan.find({
      userId,
      serverUpdatedAt: { $gt: lastSyncDate },
    });

    return NextResponse.json({
      success: true,
      serverTime: syncStartTime.toISOString(),
      transactions: serverTransactions.map((tx) => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        category: tx.category,
        note: tx.note,
        exchangeRate: tx.exchangeRate,
        walletId: tx.accountId,
        deleted: tx.deleted,
        createdAt: tx.createdAt.toISOString(),
        updatedAt: tx.updatedAt.toISOString(),
      })),
      debts: serverDebts.map((d) => ({
        id: d._id,
        person: d.person,
        amount: d.amount,
        currency: d.currency,
        status: d.status,
        deleted: d.deleted,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      })),
      wallets: serverWallets.map((w) => ({
        id: w._id,
        name: w.name,
        currency: w.currency,
        deleted: w.deleted,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      })),
      buffers: serverBuffers.map((b) => ({
        id: b._id,
        name: b.name,
        purpose: b.purpose,
        annualEstimate: b.annualEstimate,
        currentBalance: b.currentBalance,
        currency: b.currency,
        deleted: b.deleted,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      })),
      allocationPlans: serverAllocationPlans.map((p) => ({
        id: p._id,
        name: p.name,
        isDefault: p.isDefault,
        percentSavings: p.percentSavings,
        percentDebt: p.percentDebt,
        percentInvestment: p.percentInvestment,
        percentGuiltFree: p.percentGuiltFree,
        deleted: p.deleted,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      subscription: {
        status: user.subscriptionStatus,
        endsAt: user.subscriptionEndsAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Sync failed: ' + message }, { status: 500 });
  }
}

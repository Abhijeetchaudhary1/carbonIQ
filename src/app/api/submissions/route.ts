// ============================================================================
// Carbon Compass — Submissions API Route
// ============================================================================
// POST /api/submissions  → Save or update a user's carbon assessment
// GET  /api/submissions  → (Admin) Retrieve all submissions

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { SubmissionDocument } from '@/lib/db-types';
import type { AssessmentData, CarbonResults, DailyActionEntry, HistoryEntry } from '@/lib/types';

// ---------------------------------------------------------------------------
// POST — Save a new assessment or update an existing session's record
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string;
      assessmentData: AssessmentData;
      carbonResults: CarbonResults;
      dailyActions?: DailyActionEntry[];
      history?: HistoryEntry[]; // Allow history array
    };

    const { sessionId, assessmentData, carbonResults, dailyActions = [], history = [] } = body;

    if (!sessionId || !assessmentData || !carbonResults) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, assessmentData, carbonResults' },
        { status: 400 }
      );
    }

    // Gracefully handle missing DB config for demo/frontend challenge purposes
    if (!process.env.MONGODB_URI) {
      console.warn('[/api/submissions POST] MONGODB_URI not set. Mocking success.');
      return NextResponse.json({ success: true, mocked: true });
    }

    const collection = await getCollection('submissions');
    const now = new Date().toISOString();

    // Upsert: update the existing session's document, or create a new one
    await collection.updateOne(
      { sessionId },
      {
        $set: {
          assessmentData,
          carbonResults,
          dailyActions,
          history,
          lastUpdated: now,
          userAgent: req.headers.get('user-agent') ?? undefined,
        } satisfies Partial<SubmissionDocument>,
        $setOnInsert: {
          sessionId,
          createdAt: now,
        } satisfies Partial<SubmissionDocument>,
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/submissions POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update daily actions for an existing session
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string;
      dailyActions: DailyActionEntry[];
    };

    const { sessionId, dailyActions } = body;

    if (!sessionId || !dailyActions) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, dailyActions' },
        { status: 400 }
      );
    }

    // Gracefully handle missing DB config for demo/frontend challenge purposes
    if (!process.env.MONGODB_URI) {
      console.warn('[/api/submissions PATCH] MONGODB_URI not set. Mocking success.');
      return NextResponse.json({ success: true, mocked: true });
    }

    const collection = await getCollection('submissions');

    await collection.updateOne(
      { sessionId },
      {
        $set: {
          dailyActions,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/submissions PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET — Retrieve all submissions (for your own admin review)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  // Basic protection: require a secret admin key via query param
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get('key');

  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Gracefully handle missing DB config for demo/frontend challenge purposes
  if (!process.env.MONGODB_URI) {
    console.warn('[/api/submissions GET] MONGODB_URI not set. Returning empty array.');
    return NextResponse.json({ submissions: [] });
  }

  try {
    const collection = await getCollection('submissions');
    const submissions = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('[/api/submissions GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

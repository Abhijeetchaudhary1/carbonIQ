import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'MONGODB_URI not set' }, { status: 500 });
  }

  try {
    const collection = await getCollection('submissions');
    
    // Fetch the most recent submission
    const latestSubmission = await collection
      .find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(1)
      .toArray();

    if (latestSubmission.length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
    }

    return NextResponse.json({ submission: latestSubmission[0] });
  } catch (err) {
    console.error('[/api/submissions/latest GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

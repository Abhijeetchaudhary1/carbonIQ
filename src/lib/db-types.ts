// ============================================================================
// Carbon Compass — MongoDB Document Types
// ============================================================================

import type { ObjectId } from 'mongodb';
import type { AssessmentData, CarbonResults, DailyActionEntry } from './types';

/**
 * A full user submission document stored in MongoDB.
 * One document per browser session — updated in-place as the user
 * completes daily actions or re-takes the assessment.
 */
export interface SubmissionDocument {
  _id?: ObjectId;
  /** Anonymous identifier generated per browser session */
  sessionId: string;
  /** ISO timestamp of first submission */
  createdAt: string;
  /** ISO timestamp of last update */
  lastUpdated: string;
  /** The raw answers the user entered in the assessment form */
  assessmentData: AssessmentData;
  /** Calculated carbon footprint results */
  carbonResults: CarbonResults;
  /** Log of daily actions completed across all dates */
  dailyActions: DailyActionEntry[];
  /** Log of history entries */
  history?: import('./types').HistoryEntry[];
  /** User-agent string for basic analytics (no PII) */
  userAgent?: string;
}

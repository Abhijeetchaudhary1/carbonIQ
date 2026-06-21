// ============================================================================
// Carbon Compass — MongoDB Client Singleton
// ============================================================================
// Fully lazy initialization: the client is created only on the first call to
// getCollection(), never at module load time. This lets Next.js build without
// MONGODB_URI being set in the build environment (Vercel injects it at runtime).

import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'Missing MONGODB_URI environment variable. ' +
      'Add it to .env.local (dev) or Vercel Environment Variables (production).'
    );
  }

  // In development, cache on the global object so HMR doesn't leak connections.
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  // In production each module instance gets its own promise (serverless functions
  // are short-lived, so connection reuse within one invocation is sufficient).
  return new MongoClient(uri).connect();
}

/**
 * Get the carboniq database and a named collection.
 * Connection is established lazily on the first call.
 */
export async function getCollection(collectionName: string) {
  const mongoClient = await getClientPromise();
  const db = mongoClient.db('carboniq');
  return db.collection(collectionName);
}



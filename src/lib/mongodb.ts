import { MongoClient } from "mongodb";

const primaryUri = process.env.MONGODB_URI;
const fallbackUri = process.env.MONGODB_URI_FALLBACK ?? process.env.MONGODB_LOCAL_URI;

if (!primaryUri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {};

async function connectWithFallback(uri: string, fallback?: string) {
  const client = new MongoClient(uri, options);
  try {
    await client.connect();
    return client;
  } catch (error) {
    if (!fallback) {
      throw error;
    }
    console.warn("Primary MongoDB URI failed. Retrying with fallback URI.", error);
    const fallbackClient = new MongoClient(fallback, options);
    await fallbackClient.connect();
    return fallbackClient;
  }
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithFallback(primaryUri, fallbackUri);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectWithFallback(primaryUri, fallbackUri);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

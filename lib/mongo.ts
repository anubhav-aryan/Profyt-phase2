import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

type MongoCache = {
  client: MongoClient | undefined;
  promise: Promise<MongoClient> | undefined;
};

const globalForMongo = globalThis as typeof globalThis & {
  profytMongo?: MongoCache;
};

function cache(): MongoCache {
  if (!globalForMongo.profytMongo) {
    globalForMongo.profytMongo = { client: undefined, promise: undefined };
  }
  return globalForMongo.profytMongo;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  const c = cache();
  if (c.client) return c.client;
  if (!c.promise) {
    c.promise = MongoClient.connect(uri);
  }
  c.client = await c.promise;
  return c.client;
}

/** Default database from the connection string (e.g. Phase 1 `profyt`). */
export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db();
}

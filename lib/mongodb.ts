import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

function missingMongoUriError() {
  return new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

function missingMongoClientPromise(): Promise<MongoClient> {
  return {
    then<TResult1 = MongoClient, TResult2 = never>(
      onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2> {
      return Promise.reject(missingMongoUriError()).then(onfulfilled, onrejected)
    },
    catch<TResult = never>(
      onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
    ): Promise<MongoClient | TResult> {
      return Promise.reject(missingMongoUriError()).catch(onrejected)
    },
    finally(onfinally?: (() => void) | null): Promise<MongoClient> {
      return Promise.reject(missingMongoUriError()).finally(onfinally ?? undefined)
    },
    [Symbol.toStringTag]: "Promise",
  }
}

let client
let clientPromise: Promise<MongoClient>

if (!uri) {
  clientPromise = missingMongoClientPromise()
} else if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, avoid the HMR global cache.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

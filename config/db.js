const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env file");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (db) return db;

  await client.connect();

  db = client.db(process.env.DB_NAME || "booknook");

  await db.command({ ping: 1 });

  console.log("✅ MongoDB connected successfully!");

  return db;
}

module.exports = { connectDB };
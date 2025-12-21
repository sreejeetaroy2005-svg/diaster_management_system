//database connection
// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb+srv://sreejeetaroy2005_db_user:<db_password>@cluster0.s1mj5if.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("disastermanagement"); // replace with your DB name
    console.log("✅ Connected to MongoDB Atlas!");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

function getDB() {
  if (!db) throw new Error("Database not connected. Call connectDB first.");
  return db;
}

module.exports = { connectDB, getDB };

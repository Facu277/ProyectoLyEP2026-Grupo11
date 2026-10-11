const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI no está configurada");
}

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db();

    console.log("MongoDB conectado correctamente");

    return db;
  } catch (error) {
    console.error(
      "Error al conectar con MongoDB:",
      error.message
    );

    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error(
      "La base de datos todavía no fue inicializada"
    );
  }

  return db;
}

module.exports = {
  connectDB,
  getDB
};
const { MongoClient } = require('mongodb');
require('dotenv').config();


const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DATABASE_NAME;

let db:any = null;

export const connect = async () => {
  if (db) {
    return db;
  }

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    //console.log('Conexión exitosa a MongoDB');

    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Error de conexión:', err);
    throw err;
  }
}

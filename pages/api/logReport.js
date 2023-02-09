import { MongoClient } from 'mongodb';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient('mongodb+srv://demodb:demodb@metaverse.ofmwexd.mongodb.net/?retryWrites=true&w=majority');
    await client.connect();
    console.log('Connected to mongo');
    const db = client.db()
    const collection = db.collection("reports")
    await collection.insertOne(req.body);
    client.close()
    res.status(200).json({ msg: 'event logged' });
  } else res.status(405).json({msg: 'Invalid request method'});
}
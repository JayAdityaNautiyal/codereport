import { MongoClient } from 'mongodb';
import { ChatGPTAPI } from 'chatgpt'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient('mongodb+srv://demodb:demodb@metaverse.ofmwexd.mongodb.net/?retryWrites=true&w=majority');
    await client.connect();
    console.log('Connected to mongo');
    const db = client.db()
    const collection = db.collection("reports");

    const api = new ChatGPTAPI({
      apiKey: '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'
    })
    // console.log(req.body)
    // console.log(JSON.stringify(req.body.head_commit))
    const resp = await api.sendMessage(`Tell  all the keys of this stringified JSON : ${JSON.stringify(req.body.head_commit)}`)
    console.log("chat gpt output", resp.text)
    await collection.insertOne({output : resp.text});
    client.close()
    res.status(200).json({ msg: 'event logged' });
  } else res.status(405).json({msg: 'Invalid request method'});
}
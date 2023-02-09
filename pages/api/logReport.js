import { MongoClient } from "mongodb";
import { ChatGPTAPI } from "chatgpt";
import axios from "axios";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = new MongoClient(
      "mongodb+srv://demodb:demodb@metaverse.ofmwexd.mongodb.net/?retryWrites=true&w=majority"
    );
    await client.connect();
    console.log("Connected to mongo");
    const db = client.db();
    const collection = db.collection("reports");
    
    const api = new ChatGPTAPI({
      apiKey: "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",
    });

    for (const filepath of req.body.head_commit.modified) {
      const url = `https://raw.githubusercontent.com/${req.body.repository.owner.name}/${req.body.repository.name}/main/${filepath}`;
      console.log("url = ", url)
      const response = await axios.get(url);
      console.log("response = ", response)

      const content = response.data;
      const decodedContent = Buffer.from(content, "base64").toString("utf-8");
      const resp = await api.sendMessage(
        `Tell me the quality of this code : ${decodedContent}`
      );
      console.log("chat gpt output", resp.text);
      await collection.insertOne({ output: resp.text });
    }

    
    // console.log(req.body)
    // console.log(JSON.stringify(req.body.head_commit))
   
    client.close();
    res.status(200).json({ msg: "event logged" });
  } else res.status(405).json({ msg: "Invalid request method" });
}

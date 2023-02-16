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
    console.log("api key " , process.env.NEXT_PUBLIC_OPENAI_API_KEY)
    const api = new ChatGPTAPI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      completionParams: { model:"text-davinci-003" , max_tokens:3600}
    });

    for (const filepath of req.body.head_commit.modified) {
      const url = `https://raw.githubusercontent.com/${req.body.repository.owner.name}/${req.body.repository.name}/main/${filepath}`;
      const response = await axios.get(url);

      const content = response.data;
      console.log("content= ", content , typeof content)
      // const decodedContent = Buffer.from(content, "base64").toString("utf-8");
      // console.log("decoded content = ", decodedContent)
      const resp = await api.sendMessage(
        `detailed analysis of this code written in js in terms of syntax, bugs, maintainability, coding standards and readbility - ${content}`
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

import { MongoClient } from "mongodb";
import { Configuration, OpenAIApi } from "openai"
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
    console.log("api key ", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

    const configuration = new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    for (const filepath of req.body.head_commit.modified) {
      const url = `https://raw.githubusercontent.com/${req.body.repository.owner.name}/${req.body.repository.name}/main/${filepath}`;
      console.log("url ", url)
      const response = await axios.get(url);
      // console.log("response ", response)
      const content = response.data;
      const prompt = `find the errors in the code, explain the errors and give the corrected code - ${content}`;
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 3500
      });
      console.log(completion.data.choices[0].text);
      await collection.insertOne({ output: completion.data.choices[0].text });
    }
    client.close();
    res.status(200).json({ msg: "event logged" });
  } else res.status(405).json({ msg: "Invalid request method" });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
export default function handler(req, res) {
  if (req.method === 'POST') {
    fs.writeFileSync('public/events.json', JSON.stringify(req.body));
    res.status(200).json({ msg: 'event logged' });
  } else res.status(405).json({msg: 'Invalid request method'});
}
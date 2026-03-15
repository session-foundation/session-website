import { readFileSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader('content-type', 'application/feed+json');
  res.end(readFileSync('./public/rss/feed.json'));
}

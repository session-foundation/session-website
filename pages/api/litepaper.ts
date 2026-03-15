import { readFileSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader('content-type', 'application/pdf');
  res.end(readFileSync('./public/assets/papers/Litepaper_Session_private_messenger.pdf'));
}

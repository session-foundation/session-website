import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.clearPreviewData();
  res.end('Logged out of staging environment');
}

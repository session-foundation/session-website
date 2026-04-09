import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface DonationProgressData {
  currentAmount: number;
  goalAmount: number;
  goalBlogPostUrl: string;
}

const DEFAULT_FILE_PATH = './data/donation-progress.json';

export function readDonationProgress(): DonationProgressData {
  const filePath = resolve(process.env.DONATION_DATA_FILE ?? DEFAULT_FILE_PATH);
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  return {
    currentAmount: typeof parsed.currentAmount === 'number' ? parsed.currentAmount : 0,
    goalAmount: typeof parsed.goalAmount === 'number' ? parsed.goalAmount : 0,
    goalBlogPostUrl: typeof parsed.goalBlogPostUrl === 'string' ? parsed.goalBlogPostUrl : '',
  };
}

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<DonationProgressData | { error: string }>
) {
  try {
    const data = readDonationProgress();
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (err) {
    console.error('[donation-progress] Failed to read donation data file:', err);
    res.status(500).json({ error: 'Failed to load donation progress data' });
  }
}

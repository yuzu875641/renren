// src/pages/api/invidious.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// 修正前: import { fetchWithInvidiousFallback } from '../../lib/invidious';
// 修正後:
import { fetchWithInvidiousFallback } from '../lib/invidious';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }

  try {
    const data = await fetchWithInvidiousFallback(path as string);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Invidious instances' });
  }
}

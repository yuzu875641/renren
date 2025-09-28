// src/pages/api/search.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeClient } from '@/lib/youtubei';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const youtube = await getYouTubeClient();
    const searchResults = await youtube.search(q as string);
    const results = searchResults.videos.map(v => ({...v, type: 'video'}))
    .concat(searchResults.channels.map(c => ({...c, type: 'channel'})))
    .concat(searchResults.live.map(l => ({...l, type: 'live'})));
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search YouTube with youtubei.js' });
  }
}

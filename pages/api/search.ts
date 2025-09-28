// pages/api/search.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeClient } from '@/lib/youtubei'; // @/ を使用

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const youtube = await getYouTubeClient();
    const searchResults = await youtube.search(q as string);

    // 異なる型の検索結果を、共通のプロパティを持つオブジェクトに変換
    const videos = searchResults.videos.map(v => ({
      id: v.id,
      type: 'video',
      title: v.title.text,
      author: v.author.name,
      views: v.metadata.view_count,
      thumbnailUrl: v.thumbnails[0].url,
    }));

    const channels = searchResults.channels.map(c => ({
      id: c.id,
      type: 'channel',
      title: c.title.text,
      author: c.title.text, // チャンネル名を使用
      views: 0, // チャンネルに視聴回数は存在しない
      thumbnailUrl: c.thumbnails[0].url,
    }));

    const live = searchResults.live.map(l => ({
      id: l.id,
      type: 'live',
      title: l.title.text,
      author: l.author.name,
      views: l.view_count,
      thumbnailUrl: l.thumbnails[0].url,
    }));

    // 変換された配列を結合
    const results = [...videos, ...channels, ...live];
    
    res.status(200).json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to search YouTube with youtubei.js' });
  }
      }

// pages/api/search.ts

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

    // 異なる型の検索結果をフィルタリングし、共通のプロパティを持つオブジェクトに変換
    const videos = searchResults.videos
      .filter((v: any) => v.id && v.thumbnails && v.title) // id、thumbnail、titleが存在するか確認
      .map((v: any) => ({
        id: v.id,
        type: 'video',
        title: v.title.text,
        author: v.author?.name || '不明なチャンネル',
        views: v.metadata?.view_count || 'N/A',
        thumbnailUrl: v.thumbnails[0].url,
      }));

    const channels = searchResults.channels
      .filter((c: any) => c.id && c.thumbnails && c.title) // id、thumbnail、titleが存在するか確認
      .map((c: any) => ({
        id: c.id,
        type: 'channel',
        title: c.title.text,
        author: c.title.text,
        views: 'N/A', // チャンネルに視聴回数は存在しないため
        thumbnailUrl: c.thumbnails[0].url,
      }));

    const live = searchResults.live
      .filter((l: any) => l.id && l.thumbnails && l.title) // id、thumbnail、titleが存在するか確認
      .map((l: any) => ({
        id: l.id,
        type: 'live',
        title: l.title.text,
        author: l.author?.name || '不明なチャンネル',
        views: l.view_count || 'N/A',
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

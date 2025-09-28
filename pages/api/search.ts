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

    // searchResults を `any` 型として扱い、プロパティの存在を気にしないようにする
    const results = [
      ...(searchResults.videos as any[] ?? []).map((v: any) => ({
        id: v.id,
        type: 'video',
        title: v.title?.text || 'タイトルなし',
        author: v.author?.name || '不明なチャンネル',
        views: v.metadata?.view_count || 'N/A',
        thumbnailUrl: v.thumbnails?.[0]?.url || '',
      })),
      ...(searchResults.channels as any[] ?? []).map((c: any) => ({
        id: c.id,
        type: 'channel',
        title: c.title?.text || 'タイトルなし',
        author: c.title?.text || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: c.thumbnails?.[0]?.url || '',
      })),
      ...(searchResults.live as any[] ?? []).map((l: any) => ({
        id: l.id,
        type: 'live',
        title: l.title?.text || 'タイトルなし',
        author: l.author?.name || '不明なチャンネル',
        views: l.view_count || 'N/A',
        thumbnailUrl: l.thumbnails?.[0]?.url || '',
      })),
      ...(searchResults.playlists as any[] ?? []).map((p: any) => ({
        id: p.id,
        type: 'playlist',
        title: p.title?.text || 'タイトルなし',
        author: p.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: p.thumbnails?.[0]?.url || '',
      })),
      ...(searchResults.movie as any[] ?? []).map((m: any) => ({
        id: m.id,
        type: 'movie',
        title: m.title?.text || 'タイトルなし',
        author: m.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: m.thumbnails?.[0]?.url || '',
      })),
      ...(searchResults.short_videos as any[] ?? []).map((s: any) => ({
        id: s.id,
        type: 'short_video',
        title: s.title?.text || 'タイトルなし',
        author: s.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: s.thumbnails?.[0]?.url || '',
      })),
    ];
    
    res.status(200).json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to search YouTube with youtubei.js' });
  }
}

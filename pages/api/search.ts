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
    // 存在しないプロパティにはオプショナルチェーン (?.) を使用
    const videos = (searchResults.videos ?? [])
      .filter((v: any) => v.id && v.thumbnails && v.title)
      .map((v: any) => ({
        id: v.id,
        type: 'video',
        title: v.title.text,
        author: v.author?.name || '不明なチャンネル',
        views: v.metadata?.view_count || 'N/A',
        thumbnailUrl: v.thumbnails[0].url,
      }));

    const channels = (searchResults.channels ?? [])
      .filter((c: any) => c.id && c.thumbnails && c.title)
      .map((c: any) => ({
        id: c.id,
        type: 'channel',
        title: c.title.text,
        author: c.title.text,
        views: 'N/A',
        thumbnailUrl: c.thumbnails[0].url,
      }));

    // liveプロパティが欠損している場合に備え、オプショナルチェーンと空の配列を使用
    const live = (searchResults.live ?? [])
      .filter((l: any) => l.id && l.thumbnails && l.title)
      .map((l: any) => ({
        id: l.id,
        type: 'live',
        title: l.title.text,
        author: l.author?.name || '不明なチャンネル',
        views: l.view_count || 'N/A',
        thumbnailUrl: l.thumbnails[0].url,
      }));

    const playlists = (searchResults.playlists ?? [])
      .filter((p: any) => p.id && p.thumbnails && p.title)
      .map((p: any) => ({
        id: p.id,
        type: 'playlist',
        title: p.title.text,
        author: p.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: p.thumbnails[0].url,
      }));

    const movie = (searchResults.movie ?? [])
      .filter((m: any) => m.id && m.thumbnails && m.title)
      .map((m: any) => ({
        id: m.id,
        type: 'movie',
        title: m.title.text,
        author: m.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: m.thumbnails[0].url,
      }));

    const short_videos = (searchResults.short_videos ?? [])
      .filter((s: any) => s.id && s.thumbnails && s.title)
      .map((s: any) => ({
        id: s.id,
        type: 'short_video',
        title: s.title.text,
        author: s.author?.name || '不明なチャンネル',
        views: 'N/A',
        thumbnailUrl: s.thumbnails[0].url,
      }));

    // すべての配列を結合
    const results = [...videos, ...channels, ...live, ...playlists, ...movie, ...short_videos];
    
    res.status(200).json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to search YouTube with youtubei.js' });
  }
}

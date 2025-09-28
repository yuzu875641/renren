// pages/api/search.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import ytsr from 'ytsr';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const filters = await ytsr.getFilters(q as string);
    const searchFilter = filters.get('Type')?.get('Video');
    if (!searchFilter?.url) {
      return res.status(404).json({ error: 'No video filter found' });
    }
    const searchResults = await ytsr(searchFilter.url, { limit: 20 });

    const results = searchResults.items.map((item) => {
      // itemをany型として扱うことで、プロパティの存在を気にしないようにする
      if ((item as any).type === 'video') {
        return {
          id: (item as any).id,
          type: 'video',
          title: (item as any).title,
          author: (item as any).author?.name || '不明なチャンネル',
          views: (item as any).views,
          thumbnailUrl: (item as any).bestThumbnail?.url,
        };
      } else if ((item as any).type === 'channel') {
        // channel オブジェクトには直接idプロパティがないため、URLから抽出
        const channelUrl = (item as any).url;
        const channelId = channelUrl ? channelUrl.split('/').pop() : null;
        
        return {
          id: channelId,
          type: 'channel',
          title: (item as any).name,
          author: (item as any).name,
          views: 'N/A',
          thumbnailUrl: (item as any).bestAvatar?.url,
        };
      }
      return null;
    }).filter(Boolean);

    res.status(200).json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to search YouTube with ytsr' });
  }
}

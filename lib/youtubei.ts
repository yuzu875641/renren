// src/lib/youtubei.ts

import { Innertube, UniversalCache } from 'youtubei.js';

let youtube: Innertube;

export async function getYouTubeClient() {
  if (!youtube) {
    youtube = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
      cookie: undefined,
      // 存在しないプロパティを削除
      // device_mode: undefined,
    });
  }
  return youtube;
}

export async function searchVideos(query: string) {
  const yt = await getYouTubeClient();
  const search = await yt.search(query, { type: 'video' });
  return search.videos;
}

export async function searchChannels(query: string) {
    const yt = await getYouTubeClient();
    const search = await yt.search(query, { type: 'channel' });
    return search.channels;
}

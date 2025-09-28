// pages/watch.tsx

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// watchページのデータ型を定義
interface VideoData {
  id: string;
  title: string;
  author: string;
  views: string;
  description: string;
}

const WatchPage: NextPage = () => {
  const router = useRouter();
  const { v } = router.query;
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!v) {
      setLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        // APIルートから動画データを取得
        const res = await fetch(`/api/video?v=${encodeURIComponent(v as string)}`);
        const data = await res.json();

        if (res.ok) {
          setVideoData(data);
        } else {
          setError(data.error || 'Failed to fetch video data.');
        }
      } catch (e) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [v]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!videoData) {
    return <div>No video found.</div>;
  }

  // YouTubeの動画埋め込みURL
  const videoUrl = `https://www.youtube.com/embed/${videoData.id}`;

  return (
    <div>
      <h1>{videoData.title}</h1>
      <p>by {videoData.author}</p>
      <p>{videoData.views} views</p>
      <iframe
        width="560"
        height="315"
        src={videoUrl}
        title={videoData.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p>{videoData.description}</p>
    </div>
  );
};

export default WatchPage;

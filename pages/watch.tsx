import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchWithInvidiousFallback } from '../lib/invidious';
import { getYouTubeClient } from '../lib/youtubei';
import { GetServerSideProps } from 'next';

const WatchPage = ({ videoData, relatedVideos }) => {
  if (!videoData) return <div>動画が見つかりませんでした。</div>;
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <video src={videoData.formatStreams[0].url} controls className="w-full rounded-lg" />
          <h1 className="text-2xl font-bold mt-4">{videoData.title}</h1>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">関連動画</h2>
          {relatedVideos.map((video) => (
            <div key={video.id} className="flex gap-4 mb-4">
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { v } = context.query;
  let videoData = null;
  let relatedVideos = [];

  try {
    videoData = await fetchWithInvidiousFallback(`videos/${v}`);
    
    const yt = await getYouTubeClient();
    const searchResults = await yt.search(videoData.title, { type: 'video' });
    relatedVideos = searchResults.videos;

  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      videoData,
      relatedVideos: relatedVideos.slice(0, 20), 
    },
  };
};

export default WatchPage;

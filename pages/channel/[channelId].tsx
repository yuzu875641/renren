import { GetServerSideProps } from 'next';
import { fetchWithInvidiousFallback } from '../../lib/invidious';

const ChannelPage = ({ channelData }) => {
  if (!channelData) return <div>チャンネルが見つかりませんでした。</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={channelData.authorThumbnails?.find(t => t.width === 100)?.url || '/placeholder.png'}
          alt={channelData.author}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{channelData.author}</h1>
          <p className="text-gray-400">{channelData.subCount} 登録者</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">最近の動画</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channelData.latestVideos?.map((video) => (
          <div key={video.videoId} className="bg-gray-800 rounded-lg overflow-hidden">
            {/* 動画カードのコンポーネントをここに埋め込む */}
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { channelId } = context.query;
  let channelData = null;

  try {
    channelData = await fetchWithInvidiousFallback(`channels/${channelId}`);
  } catch (error) {
    console.error(error);
  }

  return {
    props: { channelData },
  };
};

export default ChannelPage;

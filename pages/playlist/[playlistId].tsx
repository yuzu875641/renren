import { GetServerSideProps } from 'next';
import ytpl from 'ytpl';
import Link from 'next/link';

const PlaylistPage = ({ playlistData }) => {
  if (!playlistData) return <div>プレイリストが見つかりませんでした。</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">{playlistData.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlistData.items.map((item) => (
          <Link href={`/watch?v=${item.id}`} key={item.id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200">
              <img src={item.bestThumbnail.url} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold truncate">{item.title}</h2>
                <p className="text-gray-400 text-sm">再生時間: {item.duration}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { playlistId } = context.query;
  let playlistData = null;

  try {
    playlistData = await ytpl(playlistId as string);
  } catch (error) {
    console.error(error);
  }

  return {
    props: { playlistData },
  };
};

export default PlaylistPage;

import { GetServerSideProps } from 'next';
import { getYouTubeClient } from '../lib/youtubei';
import Link from 'next/link';

const SearchPage = ({ results }) => {
  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">検索結果</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => {
          if (item.type === 'video') {
            return (
              <Link href={`/watch?v=${item.id}`} key={item.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                  <img src={item.thumbnails[0].url} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">{item.title}</h2>
                    <p className="text-gray-400 text-sm">{item.author}</p>
                    <p className="text-gray-400 text-sm">{item.views} 回視聴</p>
                  </div>
                </div>
              </Link>
            );
          } else if (item.type === 'channel') {
            return (
              <Link href={`/channel/${item.id}`} key={item.id}>
                <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                  <img src={item.thumbnails[0].url} alt={item.title} className="w-16 h-16 rounded-full" />
                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-gray-400 text-sm">{item.subscribers} 登録者</p>
                  </div>
                </div>
              </Link>
            );
          } else if (item.type === 'live') {
            return (
              <Link href={`/watch?v=${item.id}`} key={item.id}>
                <div className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                  <img src={item.thumbnails[0].url} alt={item.title} className="w-full h-48 object-cover" />
                  <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">LIVE</span>
                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">{item.title}</h2>
                    <p className="text-gray-400 text-sm">{item.author}</p>
                    <p className="text-gray-400 text-sm">視聴者数: {item.view_count}</p>
                  </div>
                </div>
              </Link>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q } = context.query;
  const youtube = await getYouTubeClient();
  const searchResults = await youtube.search(q as string);
  
  const results = searchResults.videos.map(v => ({...v, type: 'video'}))
    .concat(searchResults.channels.map(c => ({...c, type: 'channel'})))
    .concat(searchResults.live.map(l => ({...l, type: 'live'})));

  return {
    props: { results },
  };
};

export default SearchPage;

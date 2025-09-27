import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">yuzutube</h1>
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="flex rounded-full overflow-hidden border border-gray-600">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="動画、チャンネル、ライブ配信を検索"
            className="flex-grow px-6 py-3 bg-gray-800 text-white focus:outline-none"
          />
          <button type="submit" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
            検索
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;

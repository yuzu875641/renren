// pages/search.tsx

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface ResultItem {
  id: string;
  type: string;
  title: string;
  author: string;
  views: string;
  thumbnailUrl: string;
}

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/search?q=${encodeURIComponent(q as string)}`);
        const data = await res.json();

        if (res.ok) {
          setResults(data);
        } else {
          setError(data.error || 'Failed to fetch search results.');
        }
      } catch (e) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (results.length === 0) {
    return <div>No results found for "{q}".</div>;
  }

  return (
    <div>
      <h1>Search Results for "{q}"</h1>
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <div>
              <img src={item.thumbnailUrl} alt={item.title} width={120} height={90} />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>by {item.author}</p>
              <p>Views: {item.views}</p>
              <p>Type: {item.type}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;

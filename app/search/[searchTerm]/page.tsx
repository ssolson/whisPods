'use client';

import EpisodeSelect from '@/app/components/EpisodeSelect';
import { useState } from 'react';

export default function Page({ params }: any) {
  const searchTerm = params.searchTerm;
  const [searchResults, setSearchResults] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/${encodeURIComponent(searchTerm)}?page=${page}&pageSize=10`,
      );

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const { data, message } = await response.json();
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setSearchResults((prev: any) => [...prev, ...data]);
      }
    } catch (error: any) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
    loadMore();
  };

  // Load initial results
  useState(() => {
    loadMore();
  });

  return (
    <main className="flex flex-col items-center">
      {loading ? null : (
        <p className="mb-4">
          Results for "<span className="font-semibold">{searchTerm}</span>"
        </p>
      )}

      <div>
        {searchResults.map((result: any) => (
          <div key={result._id} className="flex flex-col">
            <EpisodeSelect episode={result} />
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={handleLoadMoreClick}
          disabled={loading}
          className="my-4"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </main>
  );
}

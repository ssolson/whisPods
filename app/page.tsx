'use client';

import { useEffect, useState, useRef } from 'react';
import EpisodeSelect from './components/EpisodeSelect';
import { SearchBar } from '@/app/components/SearchBar';
import SearchResults from '@/app/components/SearchResults';
import { useApp } from './hooks/useApp';
import { useEpisodes } from './hooks/useEpisodes';
import { useSearch } from './hooks/useSearch';

export default function Home() {
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const { state } = useApp();
  const { performSearch, clearSearchResults } = useSearch();
  const { fetchData } = useEpisodes();

  useEffect(() => {
    if (!isFetching && hasMore) {
      setIsFetching(true);
      fetchData(page).then(() => {
        setIsFetching(false);
        // Check if fetched data is less than expected pageSize to determine if there's more data
      }).catch((error) => {
        setIsFetching(false);
      });
    }
  }, [page, hasMore, isFetching]);

  // Intersection Observer to detect when the user has scrolled to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isFetching, hasMore]);



  return (
    <div className="flex-col justify-center w-full h-full p-4 ">
      {/* Header */}
      <header className="p-4 text-white bg-gray-800">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          {/* Title */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">Too Long Didn't Listen</h1>
            <p className="mt-2">
              Summarize, trends, and references for Podcasts
            </p>
          </div>
          {/* Search Content */}
          <div className="flex items-center w-full md:w-1/2">
            <SearchBar
              onSearch={performSearch}
              clearSearchResults={clearSearchResults}
            />
          </div>
        </div>
      </header>

      {/* Episodes or Search Results */}
      <div className="">
        {/* <div className="pb-32"> */}
        <div className="">
          {state.hasSearched ? (
            <SearchResults episodes={state.searchResultEpisodes} />
          ) : (
            state.latestEpisodes &&
            state.latestEpisodes.map((episode) => (
              <EpisodeSelect key={episode._id} episode={episode} />
            ))
          )}
        </div>
      </div>
      <div ref={loader} style={{ height: '1px' }} />
    </div>
  );
}

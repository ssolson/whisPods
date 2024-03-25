'use client';
import { useState, useEffect, FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { EpisodeProps } from '@/types';
import SearchSegment from '@/app/components/SearchSegment';
import { FaWindowMinimize } from 'react-icons/fa';

const SearchPage: FC = () => {
  const [episodes, setEpisodes] = useState<EpisodeProps[]>([]);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<
    number | null
  >(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const searchParams = useSearchParams();

  // Get the searchTerm from the URL query parameters.
  const searchTerm = searchParams.get('search');

  const performSearch = async (term: string) => {
    try {
      console.log('term', term);
      const response = await fetch(`/api/search/${encodeURIComponent(term)}`);
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        setEpisodes(data.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">Search Episodes</h1>

      <div className="mt-8">
        {episodes.map((episode, index) => (
          <div
            key={index}
            className="relative mb-3 rounded border p-2 shadow"
            onClick={() =>
              setSelectedEpisodeIndex(
                index === selectedEpisodeIndex ? null : index,
              )
            }
          >
            {/* Minimize (or toggle) button */}
            {selectedEpisodeIndex === index && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedEpisodeIndex(null);
                }}
                className="absolute right-2 top-1 rounded text-white shadow"
              >
                <FaWindowMinimize />
              </button>
            )}

            <div className="bg-baseText2 rounded p-2">
              <h1 className="text-xl font-semibold">
                {episode.episode_number}: {episode.episode_title}
              </h1>
              <h3 className="text-m font-semibold">{episode.release_date}</h3>
            </div>

            {episode.matchedSegmentNumbers.map((segmentNumber) => {
              const matchedSegment = episode.episode_data.find(
                (segment) => segment.segment_number === segmentNumber,
              );

              return (
                <div key={segmentNumber}>
                  <h3 className="text-textBase text-lg font-bold">Title:</h3>

                  <h2 className="pt-1 text-lg font-semibold ">
                    {matchedSegment?.headline}
                  </h2>

                  {/* Render expanded segment details if episode is selected */}
                  {selectedEpisodeIndex === index && matchedSegment && (
                    <li
                      onClick={(event) => event.stopPropagation()}
                      className="list-none pl-0"
                    >
                      <SearchSegment
                        segment={matchedSegment}
                        showVideo={showVideo}
                        setShowVideo={setShowVideo}
                        youtube_url={episode.youtube_url}
                      />
                    </li>
                  )}
                  {/* White separator line */}
                  {segmentNumber !==
                    episode.matchedSegmentNumbers[
                      episode.matchedSegmentNumbers.length - 1
                    ] && <div className="separator my-4 h-0.5 bg-white "></div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

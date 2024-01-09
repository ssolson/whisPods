import { useState } from 'react';
import { EpisodeProps } from '@/types';
import { FaWindowMinimize } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import TDG from '../assets/the-daily-gwei.jpg';
import YouTubeEmbed from './YoutubeEmbed';
import TweetEmbed from './TweetEmbed';
import { getTweetIdFromUrl } from '@/app/utils/utils';

interface SearchResultsProps {
  episodes: EpisodeProps[] | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ episodes }) => {
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<
    number | null
  >(null);
  const [isTweetLoaded, setIsTweetLoaded] = useState<boolean>(false);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  const handleSegmentClick = (
    episodeIndex: number,
    segmentNumber: number,
    event: React.MouseEvent
  ) => {
    console.log('handleSegmentClick', episodeIndex, segmentNumber);
    // event.stopPropagation(); // Prevents the episode click event
    if (
      selectedEpisodeIndex === episodeIndex &&
      expandedSegment === segmentNumber
    ) {
      // Close the segment if it's already open
      setExpandedSegment(null);
    } else {
      // Open the clicked segment
      setExpandedSegment(segmentNumber);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mt-8">
        {episodes &&
          episodes.map((episode, index) => (
            <div
              key={index}
              className="relative p-2 mb-3 border rounded shadow"
              onClick={() =>
                setSelectedEpisodeIndex(
                  index === selectedEpisodeIndex ? null : index
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
                  className="absolute text-white rounded shadow top-1 right-2"
                >
                  <FaWindowMinimize />
                </button>
              )}

              <div className="flex items-center p-2 bg-gray-800 rounded">
                <Image
                  src={TDG}
                  alt="The Daily Gwei"
                  width={40}
                  height={40}
                  className="mr-3"
                />

                <div>
                  <h1 className="text-xl font-semibold">
                    <Link href={`/thedailygwei/${episode.episode_number}`}>
                      The Daily Gwei Refuel: {episode.episode_number}
                    </Link>
                  </h1>
                  <h3 className="font-semibold text-m">
                    {episode.release_date}
                  </h3>
                </div>
              </div>

              {episode.matchedSegmentNumbers.map((segmentNumber) => {
                const matchedSegment = episode.episode_data.find(
                  (segment) => segment.segment_number === segmentNumber
                );

                return (
                  <div
                    key={segmentNumber}
                    onClick={(e) => handleSegmentClick(index, segmentNumber, e)}
                  >
                    <h3 className="text-lg font-bold text-violet-400">
                      {matchedSegment?.headline}
                    </h3>

                    <p className="line-clamp-3 text-md ">
                      {matchedSegment?.summary}
                    </p>

                    {/* Render expanded segment details if episode is selected */}
                    {selectedEpisodeIndex === index &&
                      expandedSegment === segmentNumber &&
                      matchedSegment && (
                        <li
                          onClick={(event) => event.stopPropagation()}
                          className="pl-0 list-none"
                        >
                          {/* Sources */}
                          <div className="mt-4 ">
                            <div className="">
                              {/* Embed Tweet */}
                              {matchedSegment.URL &&
                                matchedSegment.URL.map((url) => {
                                  const tweetId = getTweetIdFromUrl(url);
                                  if (tweetId) {
                                    return (
                                      <TweetEmbed
                                        key={url}
                                        url={url}
                                        isTweetLoaded={isTweetLoaded}
                                        setIsTweetLoaded={setIsTweetLoaded}
                                      />
                                    );
                                  }
                                  return null; // Show nothing for non-Twitter URLs
                                })}
                            </div>
                          </div>

                          <YouTubeEmbed
                            youtubeUrl={episode.youtube_url}
                            startTimeMs={matchedSegment.start_time_ms}
                            maxWidth="screen-sm"
                          />
                        </li>
                      )}
                    {/* Segment separator line */}
                    {segmentNumber !==
                      episode.matchedSegmentNumbers[
                        episode.matchedSegmentNumbers.length - 1
                      ] && (
                      <div className="separator my-4 bg-white h-0.5 "></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchResults;

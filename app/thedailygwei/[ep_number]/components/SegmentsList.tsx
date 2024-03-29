'use client';
import { EpisodeProps, SegmentProps } from '@/types';
import { useState, useRef } from 'react';
import EpisodeSegment from '@/app/thedailygwei/[ep_number]/components/episodeSegment/EpisodeSegment';
import { useApp } from '@/app/hooks/useApp';

interface SegmentsListProps {
  isOrganizedByLength: boolean;
  currentEpisode: EpisodeProps;
}

export default function SegmentsList({
  isOrganizedByLength,
  currentEpisode,
}: SegmentsListProps) {
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<
    number | null
  >(null);
  const [showSegmentIndex, setShowSegmentIndex] = useState<number | null>(null);
  const segmentRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
  const { state } = useApp();

  const containerClass = state.isVideoModalOpen
    ? 'pb-[350px] overflow-y-auto'
    : 'overflow-y-hidden';

  return (
    <div className="relative flex flex-col justify-center h-full min-w-screen">
      {/* Segments */}
      <div className={`flex justify-center w-full mt-2 ${containerClass}`}>
        <ul className="list-none">
          {currentEpisode.episode_data
            .sort(
              isOrganizedByLength
                ? (a: SegmentProps, b: SegmentProps) =>
                    b.segment_length_ms - a.segment_length_ms
                : (a: SegmentProps, b: SegmentProps) =>
                    a.segment_number - b.segment_number,
            )
            .map((segment, index) => (
              <div
                key={segment.segment_number}
                className="border-b border-white border-opacity-30 bg-base"
              >
                <EpisodeSegment
                  segment={segment}
                  segmentNumber={index}
                  isOrganizedByLength={isOrganizedByLength}
                  youtube_url={currentEpisode.youtube_url}
                  showSegmentIndex={showSegmentIndex}
                  setShowSegmentIndex={setShowSegmentIndex}
                  onSegmentClick={(index) => {
                    history.pushState(null, '', `#segment-${index}`);
                    setSelectedSegmentIndex(
                      selectedSegmentIndex === index ? null : index,
                    );
                    const segmentRef = segmentRefs.current[index]?.current;
                    if (segmentRef) {
                      segmentRef.scrollIntoView();
                    }
                  }}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

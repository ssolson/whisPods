'use client';
import { useApp } from '@/app/hooks/useApp';
import { SegmentProps } from '@/types';
import { useState } from 'react';
import { BiStop } from 'react-icons/bi';
import { FaPause, FaPlayCircle, FaStop } from 'react-icons/fa';

interface SegmentHeaderProps {
  segment: SegmentProps;
  segmentNumber: number;
  showSegmentIndex: number | null;
  youtube_url: string;
  setShowSegmentIndex: (value: number | null) => void;
  isOrganizedByLength: boolean;
}

export const SegmentHeader = ({
  segment,
  segmentNumber,
  showSegmentIndex,
  setShowSegmentIndex,
  youtube_url,
  isOrganizedByLength,
}: SegmentHeaderProps) => {
  const { state, setState } = useApp();


  // Toggle segment detail view
  const handleSegmentToggle = () => {
    setShowSegmentIndex(
      showSegmentIndex === segmentNumber ? null : segmentNumber,
    );
  };

  const toggleVideoDrawer = () => {
    if(!state.isVideoModalOpen) {
      setState(() => ({
        ...state,
        isVideoModalOpen: true,
        currentYouTubeVideo: youtube_url,
        currentSegment: segment,
      }));
    } else
      {setState(() => ({
        ...state,
        isVideoModalOpen: false,
      }))}
    
  };

  return (
    <div
      className="flex items-center h-24 md:text-xl lg:text-2xl bg-gradient-to-r from-transparent to-transparent via-base1 hover:bg-base3 duration-300 w-full xl:w-[1200px] my-1 group"
      onClick={() => handleSegmentToggle()}
    >
      {/* Play Button */}
      <div className="w-2 h-full duration-500 bg-base1 group-hover:bg-secondary"></div>
      <div className="flex w-16 h-full px-2 text-center min-w-fit bg-base2">
        <button
          className="m-auto text-4xl duration-300 text-accent hover:text-secondary"
          onClick={(e)=> {e.stopPropagation(),toggleVideoDrawer()}}
        >
          <FaPlayCircle />        
        </button>
      </div>

      {/* INDEX */}
      <div
        className={`font-semibold text-center grow-0 text-secondary w-20 px-2 min-w-fit border-r border-base3 bg-base2 h-full flex ${
          isOrganizedByLength ? ' w-20' : 'w-10'
        }`}
      >
        <p className="m-auto ">
          {isOrganizedByLength
            ? `${Math.floor(segment.segment_length_ms / 60000)}:${(
                (segment.segment_length_ms % 60000) /
                1000
              )
                .toFixed(0)
                .padStart(2, '0')}`
            : segmentNumber + 1}
        </p>
      </div>
      {/* HEADLINE*/}
      <div className="flex items-start w-10/12 h-16 px-4 my-auto text-textBase max-h-16">
        <span className="my-auto text-left line-clamp-2">
          {segment.segment_title}
        </span>
      </div>
    </div>
  );
};

export default SegmentHeader;

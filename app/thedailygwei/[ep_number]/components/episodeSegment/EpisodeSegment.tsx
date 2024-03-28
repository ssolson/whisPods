'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { SegmentProps } from '@/types';
import TweetEmbed from '../../../../components/TweetEmbed';
import { FiShare } from 'react-icons/fi';
import SummarySlider from './components/SummarySlider';
import SegmentHeader from './components/SegmentHeader';
import { useSegments } from '@/app/hooks/useSegments';
import { useApp } from '@/app/hooks/useApp';

interface EpisodeSegmentProps {
  segment: SegmentProps;
  segmentNumber: number;
}

const EpisodeSegment: FC<EpisodeSegmentProps> = ({
  segment,
  segmentNumber,
}) => {
  const { handleShare, copySuccess, setCopySuccess } = useSegments();
  const { state, setState } = useApp();
  const [isTweetLoaded, setIsTweetLoaded] = useState<boolean>(false);
  const segmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if this segment is the current segment
    if (state.currentSegmentIndex === segmentNumber && segmentRef.current) {
      const element = segmentRef.current;

      // Calculate the top position of the element relative to the document
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      // Define the offset as 10% of the viewport height
      const offset = window.innerHeight * 0.1;

      // Calculate the final scroll position with offset
      const scrollToPosition = elementPosition - offset;

      // Scroll to the calculated position smoothly
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });
    }
  }, [state.currentSegmentIndex, segmentNumber]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const segmentNumFromURL = parseInt(hash.substring(1), 10);
      if (!isNaN(segmentNumFromURL) && segmentNumFromURL === segmentNumber) {
        setState(() => ({
          ...state,
          currentSegmentIndex: segmentNumber,
        }));
      }
    }
  }, [segmentNumber]);

  useEffect(() => {
    // If segment.URL is empty or contains only invalid URLs, set isTweetLoaded to true
    if (!segment.URL) {
      setIsTweetLoaded(true);
    }
  }, [segment.URL]);

  return (
    <div
      ref={segmentRef}
      id={`${segment.segment_number}`}
      className="relative align-middle shadow-inner shadow-black xl:max-w-[1200px]"
    >
      <li className="cursor-pointer">
        <SegmentHeader segment={segment} segmentNumber={segmentNumber} />
        {state.currentSegmentIndex === segmentNumber && (
          <div className="md-text-l relative w-full max-w-full flex-col bg-base1 pb-8 text-accent shadow-inner shadow-black">
            <button
              className={`absolute top-7 flex items-center justify-center rounded border border-white border-opacity-40 bg-base1 px-6 py-1 font-bold text-primary shadow-lg duration-500 hover:bg-base1 md:hover:border-opacity-100 ${
                copySuccess === true ? 'shadow-transparent ' : 'shadow-black'
              } hover:bg-baseText2 right-4 xl:right-52`}
              onClick={() => handleShare({ segment, setCopySuccess })}
            >
              {copySuccess === true ? (
                <div className="text-accent">
                  <FaCheck size={20} />
                </div>
              ) : (
                <div className="text-primary">
                  <FiShare size={20} />
                </div>
              )}
            </button>
            {isTweetLoaded ? (
              <SummarySlider segment={segment} />
            ) : (
              <div className="flex w-full items-center justify-center align-middle">
                <div className="mt-10 h-1/2 w-full text-center">
                  <div className="spinner"></div>
                  <p className="m-auto mt-3">Loading...</p>
                </div>
              </div>
            )}

            {/* Sources */}
            <div className="w-full px-3 text-center">
              {/* Embed Tweet */}
              {segment.URL &&
                segment.URL.map((url, index) => (
                  <TweetEmbed
                    key={url}
                    url={url}
                    isTweetLoaded={isTweetLoaded}
                    setIsTweetLoaded={setIsTweetLoaded}
                  />
                ))}
            </div>
          </div>
        )}
      </li>
    </div>
  );
};

export default EpisodeSegment;

'use client';
import React, { FC, useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { SegmentProps } from '@/types';
import TweetEmbed from '../../../../components/TweetEmbed';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiShare } from 'react-icons/fi';
import { handleShare } from '../../../../utils/handleShare';
import SummarySlider from './components/SummarySlider';
import SegmentHeader from './components/SegmentHeader';

interface EpisodeSegmentProps {
  segment: SegmentProps;
  segmentNumber: number;
  isOrganizedByLength: boolean;
  youtube_url: string;
  onSegmentClick: (segmentNumber: number) => void;
  showSegmentIndex: number | null;
  setShowSegmentIndex: (value: number | null) => void;
}

const EpisodeSegment: FC<EpisodeSegmentProps> = ({
  segment,
  segmentNumber,
  isOrganizedByLength,
  youtube_url,
  showSegmentIndex,
  setShowSegmentIndex,
}) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isTweetLoaded, setIsTweetLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const segmentNumFromURL = parseInt(hash.substring(1), 10);
      if (!isNaN(segmentNumFromURL) && segmentNumFromURL === segmentNumber) {
        setShowSegmentIndex(segmentNumber);
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
      id={`${segment.segment_number}`}
      className="relative align-middle shadow-inner shadow-black xl:max-w-[1200px]"
      key={segment.segment_number}
    >
      <li className="cursor-pointer">
        <SegmentHeader
          segment={segment}
          segmentNumber={segmentNumber}
          showSegmentIndex={showSegmentIndex}
          youtube_url={youtube_url}
          setShowSegmentIndex={setShowSegmentIndex}
          isOrganizedByLength={isOrganizedByLength}
        />

        {showSegmentIndex === segmentNumber && (
          <div className="md-text-l relative w-full max-w-full flex-col bg-base1 pb-8 text-accent shadow-inner shadow-black">
            <button
              className={`absolute top-7 flex items-center justify-center rounded border border-white border-opacity-40 bg-base1 px-6 py-1 font-bold text-primary shadow-lg duration-500 hover:bg-base1 md:hover:border-opacity-100 ${
                copySuccess === true ? 'shadow-transparent ' : 'shadow-black'
              } hover:bg-baseText2 right-4 xl:right-52`}
              onClick={() =>
                handleShare({ segment, youtube_url, setCopySuccess })
              }
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

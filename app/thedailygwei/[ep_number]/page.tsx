"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { EpisodeProps, SegmentProps } from "@/types";
import { useState, useEffect, useRef, createRef, useContext } from "react";
import {
  RiArrowUpCircleFill,
  RiArrowUpCircleLine,
  RiMegaphoneLine,
  RiBookLine,
} from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";

import moarImage from "@/app/assets/moar.webp";
import Segment from "@/app/components/Segment";

export default function EpisodePage({
  params,
}: {
  params: { ep_number: string };
}) {
  const [data, setData] = useState<EpisodeProps>();
  const [isELI5, setIsELI5] = useState<boolean>(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<
    number | null
  >(null);
  const [showSummary, setShowSummary] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showAllStories, setShowAllStories] = useState<boolean>(false);

  const segmentRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
  const router = useRouter();

  const handleSummaryToggle = (index: number) => {
    if (showSummary === index) {
      setShowSummary(null);
    } else {
      setShowSummary(index);
    }
  };

  const [currentEpisode, setCurrentEpisode] = useState<number>(
    parseInt(params.ep_number, 10)
  );
  const [nextEpisode, setNextEpisode] = useState<number>(
    parseInt(params.ep_number, 10) + 1
  );
  const [previousEpisode, setPreviousEpisode] = useState<number>(
    parseInt(params.ep_number, 10) - 1
  );

  useEffect(() => {
    const fetchData = async () => {
      const episodeNumber = parseInt(params.ep_number, 10);
      const res = await fetch(`/api/episode?episode_number=${episodeNumber}`);
      const json = await res.json();
      const filteredSegments = json["data"].episode_data.filter(
        (segment: SegmentProps) => segment.segment_number !== 0
      );
      const sortedData = {
        ...json["data"],
        episode_data: filteredSegments.sort(
          (a: SegmentProps, b: SegmentProps) =>
            b.segment_length_ms - a.segment_length_ms
        ),
      };
      segmentRefs.current = sortedData.episode_data.map(() =>
        createRef<HTMLDivElement>()
      );
      setData(sortedData);
      console.log(sortedData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/episode?episode_number=${currentEpisode}`);
      const json = await res.json();
      const filteredSegments = json["data"].episode_data.filter(
        (segment: SegmentProps) => segment.segment_number !== 0
      );
      const sortedData = {
        ...json["data"],
        episode_data: filteredSegments.sort(
          (a: SegmentProps, b: SegmentProps) =>
            b.segment_length_ms - a.segment_length_ms
        ),
      };
      segmentRefs.current = sortedData.episode_data.map(() =>
        createRef<HTMLDivElement>()
      );
      setData(sortedData);
      console.log(sortedData);
    };
    fetchData();
  }, [currentEpisode]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-screen overflow-y-auto w-3/8 bg-stone-950">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => {
              setCurrentEpisode(previousEpisode);
              setNextEpisode(currentEpisode);
              setPreviousEpisode(previousEpisode - 1);
            }}
            disabled={currentEpisode <= 1} // Optional: Disabling if it's the first episode
          >
            <RiArrowUpCircleFill />
          </button>
          <button
            onClick={() => {
              setCurrentEpisode(nextEpisode);
              setPreviousEpisode(currentEpisode);
              setNextEpisode(nextEpisode + 1);
            }}
          >
            <RiArrowUpCircleLine />
          </button>
        </div>
        <button
          type="button"
          className="flex items-center"
          onClick={() => router.push("/thedailygwei")}
        >
          <IoArrowBack className="mr-2" /> Episodes
        </button>

        <h3 className="mt-4 text-center text-violet-200">
          Episode {data.episode_number}
        </h3>
        <h3 className="mt-1 text-center text-violet-200">
          {data.release_date}
        </h3>
        <h4 className="text-2xl font-bold text-center text-violet-400">
          Stories
        </h4>

        <ul className="pt-2 pb-12">
          {data.episode_data
            .slice(0, showAllStories ? data.episode_data.length : 5)
            .map((segment, index) => (
              <div
                key={segment.segment_number}
                className="border-b border-violet-200 border-opacity-40"
              >
                <li
                  key={segment.segment_number}
                  className="flex w-full h-24 my-auto text-sm align-middle transition-all duration-500 cursor-pointer hover:bg-stone-800"
                  onClick={() => {
                    setSelectedSegmentIndex(
                      selectedSegmentIndex === index ? null : index
                    );
                    const segmentRef = segmentRefs.current[index]?.current;
                    if (segmentRef) {
                      segmentRef.scrollIntoView();
                    }
                  }}
                >
                  <p className="mx-4 my-auto text-3xl font-semibold text-violet-400">
                    {index + 1}.
                  </p>
                  <div className="w-4/5 p-2 my-auto">
                    <span className="text-lg">
                      {isELI5 ? segment.headline_ELI5 : segment.headline}
                    </span>
                  </div>
                </li>
                {index === selectedSegmentIndex && (
                  <div className="relative p-4">
                    <button
                      className="absolute top-0 right-0 p-2"
                      onClick={() => handleSummaryToggle(index)}
                    >
                      {showSummary === index ? (
                        <RiMegaphoneLine size={24} />
                      ) : (
                        <RiBookLine size={24} />
                      )}
                    </button>
                    {showSummary === index ? (
                      <>
                        <h3 className="text-lg font-bold text-violet-400">
                          TLDL:
                        </h3>
                        <div className="p-4 mt-4 rounded shadow-md bg-stone-950">
                          {segment.summary}
                        </div>
                      </>
                    ) : (
                      <Segment
                        segment={segment}
                        showVideo={showVideo}
                        setShowVideo={setShowVideo}
                        youtube_url={data.youtube_url}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
        </ul>
        {!showAllStories && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAllStories(true)}
              className="px-6 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Moar
              <Image
                src={moarImage}
                alt="Toggle Video"
                width={40}
                height={40}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
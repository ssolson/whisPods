import Link from 'next/link';
import Image from 'next/image';
import { EpisodeProps } from '@/types';
import { RiMegaphoneLine } from 'react-icons/ri';
import TDG from '@/app/assets/the-daily-gwei.jpg';

interface EpisodeSelectProps {
  episode: EpisodeProps;
}

export default function EpisodeSelect({ episode }: EpisodeSelectProps) {
  const topThreeSegments = episode.episode_data
    .sort((a, b) => b.segment_length_ms - a.segment_length_ms)
    .slice(0, 3);

  return (
    <Link href={`/thedailygwei/${episode.episode_number}`}>
      <div className="flex flex-col flex-grow w-full min-h-full text-center transition-all duration-500 border-t bg-stone-950 border-primary border-opacity-40 hover:bg-stone-800">
        {/* Image, Episode Number, and Date for mobile */}
        <div className="flex items-center mx-auto w-full lg:w-1/2 lg:p-0 p-2">
          <div className="flex flex-col mr-2">
            <span className=" font-bold text-secondary lg:text-2xl lg:border-b border-secondary border-opacity-40 lg:pb-1 lg:mb-2">
              {episode.episode_number}
            </span>
            <span className="text-xs text-white text-opacity-80 lg:text-sm">
              {episode.release_date}
            </span>
          </div>
          <div className="w-24 h-16 mr-1 lg:w-64 lg:h-auto lg:p-4">
            {/* Image container */}
            <Image
              src={TDG}
              alt="Background"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="w-full">
            <div className="lg:text-2xl lg:text-left text-secondary">
              {episode.episode_title
                ? episode.episode_title.toUpperCase()
                : null}
            </div>
            <div className="mt-2 text-baseText1 hidden lg:block">
              {topThreeSegments.map((segment, index) => (
                <div key={segment.segment_number} className="flex">
                  <div className="mt-1 text-primary">
                    <RiMegaphoneLine />
                  </div>

                  <p className="ml-2 text-left">{segment.segment_title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

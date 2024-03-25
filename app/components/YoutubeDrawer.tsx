`use client`;

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../hooks/useApp';

const YoutubeDrawer: React.FC = () => {
  const { state, setState } = useApp();
  const playerRef = useRef<YT.Player | null>(null);
  const playerReady = useRef(false);
  const [isVideoPaused,setIsVideoPaused] = useState(false)

  const startTimeSeconds =
    state.currentSegment && state.currentSegment.start_time_ms
      ? Math.floor(state.currentSegment.start_time_ms / 1000)
      : 0;
  const shortFormatMatch =
    state.currentEpisode && state.currentYouTubeVideo
      ? state.currentYouTubeVideo.match(/youtu.be\/([^&]+)/)
      : '';
  const videoId = shortFormatMatch ? shortFormatMatch[1] : null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTimeSeconds}?autoplay=0?rel=0`;

  // Player Initialization (Only Once)
  useEffect(() => {
    const loadYouTubeIframeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    if (!window.YT) {
      loadYouTubeIframeAPI();
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '350',
        width: '600',
        videoId: videoId,
        playerVars: {
          start: startTimeSeconds,
          autoplay: 0,
          rel: 0,
        },
        events: {
          onReady: () => {
            playerReady.current = true;
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Video Update on Segment Change
  useEffect(() => {
    if (playerRef.current && playerReady.current && videoId) {
      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: startTimeSeconds,
      });
    }
  }, [videoId, startTimeSeconds]);

 

   //Close Video
  const videoClose = () => {
      if (playerRef.current && playerReady.current) {
      playerRef.current.stopVideo(); // This stops the video playback
      
    }
    setState(() => ({
        ...state,
        isVideoModalOpen: false,
        currentYouTubeVideo: null,
        currentSegment: null,
      }))
  }

  //Stop Video Playing
  useEffect(() => {
   if (playerRef.current && playerReady.current && state.isVideoModalOpen===false) {
      playerRef.current.stopVideo(); // This stops the video playback
    }
  }, [state.isVideoModalOpen]);
  
  return (
    <div className="relative flex justify-center w-full h-full">
      <div className="w-[600px] h-[350px] ">
        <div id="youtube-player" className="w-full h-full"></div>
      </div>

      <div
        className={`hidden sm:flex flex-col w-1/3 items-center justify-center bg-base1 text-baseText`}
      >
        <div className="h-1">
          <p className="pl-4 my-4 text-2xl text-bold ">TLDL </p>
          <p className="pl-4 my-4 text-md ">
            {state.currentSegment && state.currentSegment.summary}{' '}
          </p>
        </div>
        <div className="h-full"></div>
      </div>
      <button
        className={`${
          state.isVideoModalOpen ? 'block' : 'hidden'
        } absolute px-1 text-md text-red-400 hover:bg-base3 text-center duration-300 border border-white border-opacity-40 hover:border-opacity-100 bg-base1 right-0 -top-8 w-8 md:w-16 h-8`}
        onClick={() => videoClose()}
        aria-label="Close Video"
      >
        X
      </button>
    </div>
  );
};

export default YoutubeDrawer;

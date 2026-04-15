"use client";

import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import ProgressBar from "@/components/ProgressBar";
import Controls from "@/components/Controls";
import VolumeControl from "@/components/VolumeControl";
import YouTubePlayer from "@/components/YouTubePlayer";
import { X, Music2 } from "lucide-react";

const MOCK_LYRICS: { [key: string]: string } = {
  default: `♪ ♫ ♪

Searching for lyrics...

Lyrics will appear here
when available for this song.

♪ ♫ ♪`,
};

export default function NowPlaying() {
  const { state } = usePlayer();
  const [showLyrics, setShowLyrics] = useState(false);
  const currentSong = state.queue[state.currentIndex];

  const lyrics = currentSong ? (MOCK_LYRICS[currentSong.id] || MOCK_LYRICS.default) : MOCK_LYRICS.default;

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/95 transition-transform duration-300 ${showLyrics ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-sm text-gray-400">Now Playing</span>
            <button
              onClick={() => setShowLyrics(false)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex">
            <div className="flex-1 flex items-center justify-center p-8">
              {currentSong && (
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-80 h-80 rounded-xl object-cover shadow-2xl"
                />
              )}
            </div>
            
            <div className="w-96 border-l border-white/10 p-6 overflow-y-auto">
              <h2 className="text-xl font-bold mb-2">{currentSong?.title || 'No song'}</h2>
              <p className="text-gray-400 mb-6">{currentSong?.artist || 'Unknown Artist'}</p>
              
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Music2 className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold">Lyrics</span>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                  {lyrics}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10">
            <ProgressBar />
          </div>
        </div>
      </div>

      <div className="h-28 bg-gradient-to-t from-black to-black/95 border-t border-white/10 px-4 flex items-center gap-4 pb-16 md:pb-0">
        <div className="flex items-center gap-3 w-64 cursor-pointer" onClick={() => setShowLyrics(true)}>
          {currentSong ? (
            <>
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-16 h-16 rounded object-cover cursor-pointer hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <p className="font-medium truncate text-sm cursor-pointer">{currentSong.title}</p>
                <p className="text-xs text-gray-400 truncate cursor-pointer">{currentSong.artist}</p>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No song playing</div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
          <Controls />
          <div className="w-full mt-2">
            <ProgressBar />
          </div>
        </div>

        <div className="w-64 flex items-center justify-end gap-4">
          <button
            onClick={() => setShowLyrics(true)}
            className="p-2 hover:bg-white/10 rounded-full"
            title="Lyrics"
          >
            <Music2 className="w-5 h-5" />
          </button>
          <VolumeControl />
        </div>
      </div>

      <YouTubePlayer />
    </>
  );
}

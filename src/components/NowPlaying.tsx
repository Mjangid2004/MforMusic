"use client";

import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import ProgressBar from "@/components/ProgressBar";
import Controls from "@/components/Controls";
import VolumeControl from "@/components/VolumeControl";
import YouTubePlayer from "@/components/YouTubePlayer";
import { X, Music2, Heart } from "lucide-react";

const MOCK_LYRICS: { [key: string]: string } = {
  default: `♪ ♫ ♪

Searching for lyrics...

Lyrics will appear here
when available for this song.

♪ ♫ ♪`,
};

export default function NowPlaying() {
  const { state, toggleFavorite, isFavorite } = usePlayer();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const currentSong = state.queue[state.currentIndex];

  const lyrics = currentSong ? (MOCK_LYRICS[currentSong.id] || MOCK_LYRICS.default) : MOCK_LYRICS.default;
  const liked = currentSong ? isFavorite(currentSong) : false;

  return (
    <>
      {/* Full Screen Player */}
      <div className={`fixed inset-0 z-50 bg-black transition-transform duration-300 ${showPlayer ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setShowPlayer(false)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-sm text-gray-400">Now Playing</span>
            <button
              onClick={() => setShowLyrics(true)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <Music2 className="w-6 h-6" />
            </button>
          </div>
          
          {/* Album Art */}
          <div className="flex-1 flex items-center justify-center px-8 py-4">
            {currentSong && (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full max-w-md max-h-72 md:max-h-96 rounded-xl object-cover shadow-2xl"
              />
            )}
          </div>
          
          {/* Song Info & Controls */}
          <div className="px-6 py-4 space-y-4">
            {/* Song Title & Artist */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-lg md:text-xl font-bold truncate">{currentSong?.title || 'No song'}</h2>
                <p className="text-gray-400 text-sm truncate">{currentSong?.artist || 'Unknown Artist'}</p>
              </div>
              {/* Like Button */}
              {currentSong && (
                <button
                  onClick={() => toggleFavorite(currentSong)}
                  className="p-2 hover:bg-white/10 rounded-full flex-shrink-0"
                >
                  <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <ProgressBar />

            {/* Controls */}
            <Controls />

            {/* Lyrics Toggle - Desktop */}
            <button
              onClick={() => setShowLyrics(true)}
              className="hidden md:flex w-full py-3 bg-white/10 rounded-xl items-center justify-center gap-2"
            >
              <Music2 className="w-5 h-5" />
              <span>View Lyrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics View */}
      <div className={`fixed inset-0 z-50 bg-black/95 transition-transform duration-300 ${showLyrics ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button
              onClick={() => setShowLyrics(false)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-sm text-gray-400">Lyrics</span>
            <div className="w-10"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
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
      </div>

      {/* Bottom Bar - Desktop */}
      <div className="hidden md:block h-28 bg-gradient-to-t from-black to-black/95 border-t border-white/10 px-4 flex items-center gap-4">
        <div className="flex items-center gap-3 w-64 cursor-pointer" onClick={() => setShowPlayer(true)}>
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
            onClick={() => currentSong && toggleFavorite(currentSong)}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <VolumeControl />
        </div>
      </div>

      {/* Bottom Bar - Mobile (Compact) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-40">
        <div className="px-3 pt-2">
          <ProgressBar />
        </div>
        <div className="h-16 px-3 flex items-center gap-2">
          <div className="flex items-center gap-2 w-32 cursor-pointer flex-shrink-0" onClick={() => setShowPlayer(true)}>
            {currentSong ? (
              <>
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-10 h-10 rounded object-cover cursor-pointer flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="font-medium text-xs truncate">{currentSong.title}</p>
                  <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500">No song</div>
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <Controls />
          </div>

          <button
            onClick={() => currentSong && toggleFavorite(currentSong)}
            className="p-2 hover:bg-white/10 rounded-full flex-shrink-0"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>
      </div>

      <YouTubePlayer />
    </>
  );
}

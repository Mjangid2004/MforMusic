"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useAppContext } from "@/app/page";
import { Music2, Heart, Clock } from "lucide-react";

export default function Sidebar() {
  const { state } = usePlayer();
  const { viewMode, setViewMode } = useAppContext();

  return (
    <div className="w-64 bg-black/40 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-3 py-2 mb-4">
        <Music2 className="w-8 h-8 text-indigo-400" />
        <span className="font-bold text-lg">MusicPlayer</span>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <button
          onClick={() => setViewMode('home')}
          className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${viewMode === 'home' ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </button>
        <button
          onClick={() => setViewMode('liked')}
          className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${viewMode === 'liked' ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          <Heart className={`w-5 h-5 ${viewMode === 'liked' ? 'text-pink-500' : 'text-gray-400'}`} />
          <span>Liked Songs</span>
          <span className="ml-auto text-xs text-gray-400">{state.favorites.length}</span>
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${viewMode === 'history' ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          <Clock className={`w-5 h-5 ${viewMode === 'history' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span>Recently Played</span>
        </button>
      </div>

      <div className="border-t border-white/10 pt-4 flex-1 overflow-y-auto">
        <p className="text-xs text-gray-500 px-3 mb-2">Your Library</p>
        {state.favorites.length > 0 ? (
          <div className="space-y-1">
            {state.favorites.slice(0, 8).map((song, index) => (
              <div key={`sidebar-fav-${song.id}-${index}`} className="px-3 py-2 rounded hover:bg-white/5 cursor-pointer text-sm text-gray-300 truncate">
                <Heart className="w-4 h-4 inline mr-2 text-pink-500 fill-pink-500" />
                {song.title}
              </div>
            ))}
          </div>
        ) : (
          <p className="px-3 text-sm text-gray-500">No liked songs yet</p>
        )}
      </div>
    </div>
  );
}

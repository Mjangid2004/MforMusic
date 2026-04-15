"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useAppContext } from "@/context/AppContext";
import { Music2, Heart, Clock, ListMusic, Download } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { state } = usePlayer();
  const { viewMode, setViewMode } = useAppContext();
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInstallHelp(true);
  };

  return (
    <>
      {showInstallHelp && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 hidden md:flex">
          <div className="bg-neutral-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Install MforMusic</h3>
            {isIOS ? (
              <div className="space-y-3 text-sm">
                <p>1. Open this website in <strong>Safari</strong></p>
                <p>2. Tap the <strong>Share</strong> button</p>
                <p>3. Tap <strong>"Add to Home Screen"</strong></p>
                <p>4. Tap <strong>"Add"</strong></p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p>1. Click the <strong>install icon</strong> in the address bar</p>
                <p>Or click the <strong>menu</strong> (⋮) → <strong>"Install app"</strong></p>
              </div>
            )}
            <button
              onClick={() => setShowInstallHelp(false)}
              className="w-full mt-6 py-3 bg-indigo-500 rounded-xl font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      <div className="w-64 bg-black/40 p-4 flex flex-col">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          <Music2 className="w-8 h-8 text-indigo-400" />
          <span className="font-bold text-lg">MforMusic</span>
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
            onClick={() => setViewMode('queue')}
            className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${viewMode === 'queue' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <ListMusic className={`w-5 h-5 ${viewMode === 'queue' ? 'text-indigo-400' : 'text-gray-400'}`} />
            <span>Queue</span>
            <span className="ml-auto text-xs text-gray-400">{state.queue.length}</span>
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
            <span>History</span>
          </button>
          <button
            onClick={handleInstall}
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            <Download className="w-5 h-5" />
            <span>Install App</span>
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
    </>
  );
}

"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat2 } from "lucide-react";

export default function Controls() {
  const { state, togglePlay, nextSong, prevSong, dispatch } = usePlayer();

  const currentSong = state.queue[state.currentIndex];

  const getPlayModeIcon = () => {
    switch (state.playMode) {
      case "shuffle":
        return <Shuffle className="w-5 h-5" />;
      case "repeat2":
        return <Repeat2 className="w-5 h-5" />;
      case "repeat-all":
        return <Repeat className="w-5 h-5 fill-current" />;
      default:
        return <Repeat className="w-5 h-5" />;
    }
  };

  const cyclePlayMode = () => {
    const modes = ["order", "once", "repeat2", "repeat-all", "shuffle"] as const;
    const currentIndex = modes.indexOf(state.playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: "SET_PLAY_MODE", payload: nextMode });
  };

  const getPlayModeLabel = () => {
    switch (state.playMode) {
      case "order": return "Play in order";
      case "once": return "Play once";
      case "repeat2": return "Repeat twice";
      case "repeat-all": return "Repeat all";
      case "shuffle": return "Shuffle";
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={cyclePlayMode}
        title={getPlayModeLabel()}
        className={`p-2 rounded-full transition-all duration-300 ${
          state.playMode !== "order"
            ? "text-indigo-400"
            : "text-gray-400 hover:text-white"
        }`}
      >
        {getPlayModeIcon()}
      </button>

      <button
        onClick={prevSong}
        disabled={!currentSong}
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipBack className="w-6 h-6" />
      </button>

      <button
        onClick={togglePlay}
        disabled={!currentSong}
        className="p-4 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
      >
        {state.isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>

      <button
        onClick={nextSong}
        disabled={!currentSong}
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipForward className="w-6 h-6" />
      </button>

      <div className="w-10" />
    </div>
  );
}

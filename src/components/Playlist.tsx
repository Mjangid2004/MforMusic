"use client";

import { usePlayer } from "@/context/PlayerContext";
import SongItem from "./SongItem";
import { Loader2 } from "lucide-react";

export default function Playlist() {
  const { state, getTopPlayed } = usePlayer();

  const getSongs = () => {
    switch (state.currentTab) {
      case "favorites":
        return state.favorites;
      case "history":
        return state.history;
      case "top":
        return getTopPlayed();
      case "search":
      default:
        return state.searchResults;
    }
  };

  const songs = getSongs();

  const getEmptyMessage = () => {
    switch (state.currentTab) {
      case "favorites":
        return "No favorite songs yet. Heart a song to add it here!";
      case "history":
        return "No songs played yet. Start playing some music!";
      case "top":
        return "No play history yet. Start listening!";
      case "search":
      default:
        return "Search for songs to start playing";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
      {state.isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-center px-4">
          {getEmptyMessage()}
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song) => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

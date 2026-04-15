"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Tab } from "@/lib/types";
import { Search, Heart, Clock, TrendingUp } from "lucide-react";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "search", label: "Search", icon: <Search className="w-4 h-4" /> },
  { id: "favorites", label: "Favorites", icon: <Heart className="w-4 h-4" /> },
  { id: "history", label: "History", icon: <Clock className="w-4 h-4" /> },
  { id: "top", label: "Top Played", icon: <TrendingUp className="w-4 h-4" /> },
];

export default function PlaylistTabs() {
  const { state, setCurrentTab } = usePlayer();

  const getCount = (tabId: Tab) => {
    switch (tabId) {
      case "favorites":
        return state.favorites.length;
      case "history":
        return state.history.length;
      case "top":
        return state.history.length;
      default:
        return state.searchResults.length;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
            state.currentTab === tab.id
              ? "bg-indigo-500 text-white"
              : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
          }`}
        >
          {tab.icon}
          <span className="text-sm font-medium">{tab.label}</span>
          {getCount(tab.id) > 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                state.currentTab === tab.id
                  ? "bg-white/20"
                  : "bg-white/10"
              }`}
            >
              {getCount(tab.id)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

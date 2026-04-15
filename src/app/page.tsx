"use client";

import { useEffect, useState, useCallback } from "react";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import NowPlaying from "@/components/NowPlaying";

export type ViewMode = 'home' | 'liked' | 'history';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

import { createContext, useContext } from "react";

const AppContext = createContext<AppContextType>({
  viewMode: 'home',
  setViewMode: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

function MusicPlayerApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <AppContext.Provider value={{ viewMode, setViewMode }}>
      <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <NowPlaying />
      </div>
    </AppContext.Provider>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <MusicPlayerApp />
    </PlayerProvider>
  );
}

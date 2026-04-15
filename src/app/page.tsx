"use client";

import { useEffect } from "react";
import { PlayerProvider } from "@/context/PlayerContext";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import NowPlaying from "@/components/NowPlaying";
import BottomNav from "@/components/BottomNav";

function MusicPlayerApp() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Main Content */}
        <MainContent />
      </div>
      {/* Mobile Bottom Nav */}
      <BottomNav />
      {/* Now Playing Bar */}
      <NowPlaying />
    </div>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <AppProvider>
        <MusicPlayerApp />
      </AppProvider>
    </PlayerProvider>
  );
}

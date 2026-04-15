"use client";

import { useEffect, useState } from "react";
import { PlayerProvider } from "@/context/PlayerContext";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import NowPlaying from "@/components/NowPlaying";
import BottomNav from "@/components/BottomNav";

function MusicPlayerApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }

    // PWA Install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <PlayerProvider>
      <AppProvider>
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
          {/* Install Banner */}
          {showInstall && (
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between md:hidden">
              <span className="text-sm">Install MforMusic</span>
              <button
                onClick={handleInstall}
                className="bg-white text-indigo-600 px-4 py-1 rounded-full text-sm font-medium"
              >
                Install
              </button>
            </div>
          )}
          
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
      </AppProvider>
    </PlayerProvider>
  );
}

export default function Home() {
  return <MusicPlayerApp />;
}

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

  useEffect(() => {
    document.documentElement.classList.add("dark");

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }

    // PWA Install prompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Auto-click install button if exists
      const installBtn = document.getElementById('install-trigger');
      if (installBtn) {
        (installBtn as any).prompt = e;
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      alert("📱 To install on iPhone:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add'");
      return;
    }

    const trigger = document.getElementById('install-trigger') as any;
    if (trigger && trigger.prompt) {
      trigger.prompt();
      const { outcome } = await trigger.prompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      }
    } else {
      alert("💡 To install:\n\nOn Chrome: Tap menu (⋮) → 'Install app'\n\nOr open the app in Chrome and look for the install icon in the address bar.");
    }
  };

  return (
    <PlayerProvider>
      <AppProvider>
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
          <button 
            id="install-trigger" 
            style={{ display: 'none' }} 
            onClick={handleInstallClick}
          />
          
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

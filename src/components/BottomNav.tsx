"use client";

import { useAppContext } from "@/context/AppContext";
import { Home, Heart, Clock, ListMusic, Download } from "lucide-react";

export default function BottomNav() {
  const { viewMode, setViewMode, clearSearch } = useAppContext();

  const handleInstall = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      alert("To install: Tap Share → Add to Home Screen");
    } else {
      const installBtn = document.getElementById('install-btn');
      if (installBtn) {
        (installBtn as any).click();
      }
    }
  };

  const tabs = [
    { id: "home" as const, label: "Home", icon: <Home className="w-6 h-6" /> },
    { id: "queue" as const, label: "Queue", icon: <ListMusic className="w-6 h-6" /> },
    { id: "liked" as const, label: "Liked", icon: <Heart className="w-6 h-6" /> },
    { id: "history" as const, label: "History", icon: <Clock className="w-6 h-6" /> },
  ];

  const handleTabClick = (tabId: typeof tabs[0]['id']) => {
    clearSearch();
    setViewMode(tabId);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50 h-14">
      <div className="flex justify-around items-center h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              viewMode === tab.id
                ? "text-indigo-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={handleInstall}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-white transition-colors"
        >
          <Download className="w-6 h-6" />
          <span className="text-xs mt-1">Install</span>
        </button>
      </div>
      <button id="install-btn" style={{ display: 'none' }} />
    </div>
  );
}

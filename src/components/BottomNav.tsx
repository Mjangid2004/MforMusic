"use client";

import { useAppContext } from "@/context/AppContext";
import { Home, Heart, Clock, ListMusic, Download } from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const { viewMode, setViewMode, clearSearch } = useAppContext();
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInstallHelp(true);
  };

  const tabs = [
    { id: "home" as const, label: "Home", icon: <Home className="w-6 h-6" /> },
    { id: "queue" as const, label: "Queue", icon: <ListMusic className="w-6 h-6" /> },
    { id: "liked" as const, label: "Liked", icon: <Heart className="w-6 h-6" /> },
    { id: "history" as const, label: "History", icon: <Clock className="w-6 h-6" /> },
  ];

  const handleTabClick = (tabId: typeof tabs[0]['id']) => {
    setShowInstallHelp(false);
    clearSearch();
    setViewMode(tabId);
  };

  return (
    <>
      {showInstallHelp && (
        <div 
          className="md:hidden fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          onClick={(e) => { e.stopPropagation(); setShowInstallHelp(false); }}
        >
          <div className="bg-neutral-900 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Install MforMusic</h3>
            {isIOS ? (
              <div className="space-y-3 text-sm">
                <p>1. Tap the <strong>Share</strong> button (square with up arrow)</p>
                <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                <p>3. Tap <strong>"Add"</strong></p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p>1. Tap the <strong>menu button</strong> (three dots) in top right</p>
                <p>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></p>
                <p>3. Tap <strong>"Install"</strong></p>
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
      </div>
    </>
  );
}

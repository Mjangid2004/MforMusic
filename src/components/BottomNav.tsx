"use client";

import { useAppContext, ViewMode } from "@/context/AppContext";
import { Home, Heart, Clock } from "lucide-react";

export default function BottomNav() {
  const { viewMode, setViewMode } = useAppContext();

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-6 h-6" /> },
    { id: "liked", label: "Liked", icon: <Heart className="w-6 h-6" /> },
    { id: "history", label: "History", icon: <Clock className="w-6 h-6" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
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
      </div>
    </div>
  );
}

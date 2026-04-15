"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ViewMode = 'home' | 'liked' | 'history';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const AppContext = createContext<AppContextType>({
  viewMode: 'home',
  setViewMode: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  return (
    <AppContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </AppContext.Provider>
  );
}

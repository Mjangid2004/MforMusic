export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  videoId: string;
  isLocal?: boolean;
}

export type PlayMode = "order" | "once" | "repeat2" | "repeat-all" | "shuffle";
export type Theme = "light" | "dark" | "dynamic";
export type Tab = "search" | "favorites" | "history" | "top";

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  history: Song[];
  favorites: Song[];
  playMode: PlayMode;
  repeatCount: number;
  volume: number;
  isPlaying: boolean;
  theme: Theme;
  currentTab: Tab;
  searchQuery: string;
  searchResults: Song[];
  isLoading: boolean;
  isStreamLoading: boolean;
  currentTime: number;
  duration: number;
  dynamicColors: [string, string];
}

"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { Song, PlayMode, Theme, Tab } from "@/lib/types";

type Action =
  | { type: "SET_QUEUE"; payload: Song[] }
  | { type: "ADD_TO_QUEUE"; payload: Song }
  | { type: "PLAY_SONG"; payload: { song: Song; queue?: Song[] } }
  | { type: "NEXT_SONG" }
  | { type: "PREV_SONG" }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PLAY_MODE"; payload: PlayMode }
  | { type: "SET_REPEAT_COUNT"; payload: number }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_TAB"; payload: Tab }
  | { type: "SET_SEARCH_RESULTS"; payload: Song[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_FAVORITE"; payload: Song }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_DYNAMIC_COLORS"; payload: [string, string] }
  | { type: "CLEAR_HISTORY" }
  | { type: "ADD_TO_HISTORY"; payload: Song }
  | { type: "LOAD_SAVED_DATA"; payload: { favorites: Song[]; history: Song[]; queue: Song[]; currentIndex: number; volume: number; theme: Theme } };

interface PlayerState {
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

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
  history: [],
  favorites: [],
  playMode: "order",
  repeatCount: 0,
  volume: 0.7,
  isPlaying: false,
  theme: "dark",
  currentTab: "search",
  searchQuery: "",
  searchResults: [],
  isLoading: false,
  isStreamLoading: false,
  currentTime: 0,
  duration: 0,
  dynamicColors: ["#6366f1", "#8b5cf6"],
};

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "SET_QUEUE":
      return { ...state, queue: action.payload };
    case "ADD_TO_QUEUE":
      return { ...state, queue: [...state.queue, action.payload] };
    case "PLAY_SONG": {
      const { song, queue } = action.payload;
      const newQueue = queue || state.queue;
      const index = newQueue.findIndex((s) => s.id === song.id);
      return {
        ...state,
        queue: newQueue,
        currentIndex: index >= 0 ? index : 0,
        isPlaying: true,
      };
    }
    case "NEXT_SONG": {
      if (state.queue.length === 0) return state;
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.playMode === "repeat-all") {
          nextIndex = 0;
        } else {
          return { ...state, isPlaying: false };
        }
      }
      return { ...state, currentIndex: nextIndex, isPlaying: true };
    }
    case "PREV_SONG": {
      if (state.queue.length === 0) return state;
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.playMode === "repeat-all" ? state.queue.length - 1 : 0;
      }
      return { ...state, currentIndex: prevIndex, isPlaying: true };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_PLAY_MODE":
      return { ...state, playMode: action.payload, repeatCount: 0 };
    case "SET_REPEAT_COUNT":
      return { ...state, repeatCount: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_TAB":
      return { ...state, currentTab: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_FAVORITE": {
      const song = action.payload;
      const isFavorite = state.favorites.some((s) => s.id === song.id);
      const newFavorites = isFavorite
        ? state.favorites.filter((s) => s.id !== song.id)
        : [...state.favorites, song];
      return { ...state, favorites: newFavorites };
    }
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_DYNAMIC_COLORS":
      return { ...state, dynamicColors: action.payload };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    case "ADD_TO_HISTORY": {
      const filteredHistory = state.history.filter((s) => s.id !== action.payload.id);
      const newHistory = [action.payload, ...filteredHistory].slice(0, 50);
      return { ...state, history: newHistory };
    }
    case "LOAD_SAVED_DATA": {
      return {
        ...state,
        favorites: action.payload.favorites || [],
        history: action.payload.history || [],
        queue: action.payload.queue || [],
        currentIndex: action.payload.currentIndex ?? -1,
        volume: action.payload.volume ?? 0.7,
        theme: action.payload.theme ?? "dark",
      };
    }
    default:
      return state;
  }
}

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  toggleFavorite: (song: Song) => void;
  isFavorite: (song: Song) => boolean;
  getTopPlayed: () => Song[];
  setCurrentTab: (tab: Tab) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const playCountRef = useRef<{ [key: string]: number }>({});
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const savedFavorites = localStorage.getItem("favorites");
      const savedHistory = localStorage.getItem("history");
      const savedQueue = localStorage.getItem("queue");
      const savedCurrentIndex = localStorage.getItem("currentIndex");
      const savedVolume = localStorage.getItem("volume");
      const savedTheme = localStorage.getItem("theme");
      const savedPlayCount = localStorage.getItem("playCount");

      dispatch({
        type: "LOAD_SAVED_DATA",
        payload: {
          favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
          history: savedHistory ? JSON.parse(savedHistory) : [],
          queue: savedQueue ? JSON.parse(savedQueue) : [],
          currentIndex: savedCurrentIndex ? parseInt(savedCurrentIndex) : -1,
          volume: savedVolume ? parseFloat(savedVolume) : 0.7,
          theme: (savedTheme as Theme) || "dark",
        },
      });

      if (savedPlayCount) {
        playCountRef.current = JSON.parse(savedPlayCount);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("favorites", JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("history", JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("queue", JSON.stringify(state.queue));
  }, [state.queue]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("currentIndex", state.currentIndex.toString());
  }, [state.currentIndex]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("volume", state.volume.toString());
  }, [state.volume]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem("playCount", JSON.stringify(playCountRef.current));
  }, [state.currentIndex]);

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    dispatch({ type: "PLAY_SONG", payload: { song, queue } });
    dispatch({ type: "ADD_TO_HISTORY", payload: song });
    
    if (playCountRef.current[song.id]) {
      playCountRef.current[song.id]++;
    } else {
      playCountRef.current[song.id] = 1;
    }
  }, []);

  const togglePlay = useCallback(() => {
    dispatch({ type: "TOGGLE_PLAY" });
  }, []);

  const nextSong = useCallback(() => {
    if (state.queue.length === 0) return;
    const nextIndex = (state.currentIndex + 1) % state.queue.length;
    const nextSongToPlay = state.queue[nextIndex];
    
    if (!nextSongToPlay || !nextSongToPlay.videoId) return;
    
    if (nextIndex === 0 && state.playMode !== "repeat-all") {
      dispatch({ type: "TOGGLE_PLAY" });
      return;
    }
    playSong(nextSongToPlay);
  }, [state.queue, state.currentIndex, state.playMode, playSong]);

  const prevSong = useCallback(() => {
    if (state.queue.length === 0) return;
    if (state.currentTime > 3) {
      dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
      return;
    }
    const prevIndex = state.currentIndex - 1 < 0 ? state.queue.length - 1 : state.currentIndex - 1;
    playSong(state.queue[prevIndex]);
  }, [state.queue, state.currentIndex, state.currentTime, playSong]);

  const seek = useCallback((time: number) => {
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  }, []);

  const toggleFavorite = useCallback((song: Song) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: song });
  }, []);

  const isFavorite = useCallback((song: Song) => {
    return state.favorites.some((s) => s.id === song.id);
  }, [state.favorites]);

  const getTopPlayed = useCallback(() => {
    return Object.entries(playCountRef.current)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([id]) => {
        return [...state.history, ...state.favorites, ...state.queue].find((s) => s.id === id);
      })
      .filter(Boolean) as Song[];
  }, [state.history, state.favorites, state.queue]);

  const setCurrentTab = useCallback((tab: Tab) => {
    dispatch({ type: "SET_TAB", payload: tab });
  }, [dispatch]);

  return (
    <PlayerContext.Provider
      value={{
        state,
        dispatch,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        toggleFavorite,
        isFavorite,
        getTopPlayed,
        setCurrentTab,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import YouTube from "react-youtube";
import { usePlayer } from "@/context/PlayerContext";

export default function YouTubePlayer() {
  const { state, dispatch } = usePlayer();
  const playerRef = useRef<any>(null);
  const currentVideoId = useRef<string | null>(null);
  const currentSong = state.queue[state.currentIndex];

  const handleReady = useCallback((event: any) => {
    playerRef.current = event.target;
    (window as any).youtubePlayer = event.target;
    event.target.setVolume(state.volume * 100);
  }, [state.volume]);

  const handleEnd = useCallback(() => {
    if (state.playMode === "once") {
      dispatch({ type: "TOGGLE_PLAY" });
    } else if (state.playMode === "repeat2") {
      if (state.repeatCount < 2) {
        dispatch({ type: "SET_REPEAT_COUNT", payload: state.repeatCount + 1 });
        playerRef.current?.seekTo(0);
        playerRef.current?.playVideo();
      } else {
        dispatch({ type: "SET_REPEAT_COUNT", payload: 0 });
        dispatch({ type: "NEXT_SONG" });
      }
    } else {
      dispatch({ type: "NEXT_SONG" });
    }
  }, [state.playMode, state.repeatCount, dispatch]);

  useEffect(() => {
    if (!playerRef.current || !currentSong) return;

    if (currentSong.videoId !== currentVideoId.current) {
      currentVideoId.current = currentSong.videoId;
      dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
      dispatch({ type: "SET_DURATION", payload: 0 });
      playerRef.current?.loadVideoById(currentSong.videoId);
      playerRef.current?.setVolume(state.volume * 100);
    }
  }, [currentSong?.id, dispatch, state.volume]);

  useEffect(() => {
    if (!playerRef.current || !currentSong) return;

    if (state.isPlaying) {
      playerRef.current?.playVideo();
    } else {
      playerRef.current?.pauseVideo();
    }
  }, [state.isPlaying, currentSong]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current?.setVolume(state.volume * 100);
  }, [state.volume]);

  const updateProgress = useCallback(() => {
    if (playerRef.current) {
      const time = playerRef.current.getCurrentTime?.() || 0;
      const duration = playerRef.current.getDuration?.() || 0;
      if (time > 0) dispatch({ type: "SET_CURRENT_TIME", payload: time });
      if (duration > 0) dispatch({ type: "SET_DURATION", payload: duration });
    }
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(updateProgress, 200);
    return () => clearInterval(interval);
  }, [updateProgress]);

  const opts = {
    height: "1",
    width: "1",
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (!currentSong) return null;

  return (
    <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
      <YouTube
        videoId={currentSong.videoId}
        opts={opts}
        onReady={handleReady}
        onEnd={handleEnd}
        containerClassName="youtube-container"
      />
    </div>
  );
}

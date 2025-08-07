
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { useEffect, useRef } from "react";

const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const streamUrl = import.meta.env.VITE_API_URL + "/songs/stream/";

  const {currentSong, isPlaying, playNext} =  useAudioPlayerStore();

  // handles play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handles ending of song
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio?.addEventListener("ended", handleEnded);

    // cleanup function remove listener
    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  // handles song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // check if this is actually a new song
    let currentSongUrl = streamUrl.concat(currentSong.uploadedSongId)
    console.log(currentSongUrl)
    const isSongChange = prevSongRef.current !== currentSongUrl;
    if (isSongChange) {
      audio.src = currentSongUrl;
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSongUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return {audioRef}
}

export default useAudioPlayer
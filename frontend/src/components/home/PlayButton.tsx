import { SongModel } from "@/models/Song"

import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

const PlayButton = ({song, sectionId}: {song: SongModel, sectionId: string}) => {
  const {currentSong, isPlaying, currentSection, setCurrentSong, togglePlay, setCurrentSection, initializeQueue} = useAudioPlayerStore();
  const {top5Songs, topSongsByGenre, recentlyReleasedSongs } = useMusicStore();
  const isCurrentSong = currentSong?._id === song._id;
  const isSmallScreen = useIsSmallScreen();

  const handlePlay = () => {
    if(isCurrentSong) 
      togglePlay();
    else 
      setCurrentSong(song);
    setCurrentSection(sectionId);
    initializeQueueBySection(sectionId);
  }

  const initializeQueueBySection = (sectionId: string) => {
    switch (sectionId) {
      case "top_5_songs":
        initializeQueue(top5Songs);
        break;
      case "top_rock_songs":
        initializeQueue(topSongsByGenre);
        break;
      case "recently_uploaded":
        initializeQueue(recentlyReleasedSongs);
        break;
    }
  }
  return (
    <Button
      size='icon'
      className={`absolute bottom-3 right-2 rounded-full cursor-pointer bg-teal-500 hover:bg-teal-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					(isCurrentSong && sectionId == currentSection) || isSmallScreen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
      onClick={handlePlay}
    >
      {isCurrentSong && isPlaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
    </Button>
  )
}

export default PlayButton
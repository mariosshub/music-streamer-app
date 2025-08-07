import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { formatTime } from "@/utils/formatTime";
import { Music, Pause, Play, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useState } from "react";

const AudioControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = useAudioPlayerStore();
  const {audioRef} = useAudioPlayer();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
  const isSmallScreen = useIsSmallScreen();

  const handleEnded = () => {
    useAudioPlayerStore.setState({ isPlaying: false });
  };

  const handleSeek = (value: number[]) => {
    console.log(value)
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

  // give bright colors when song is playing
  const gradientColor = currentSong ? 
   'from-indigo-950/40 via-cyan-900/35 to-cyan-900/40' :
   'from-indigo-950/20 via-cyan-900/30 to-cyan-900/20'
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

    // fires when time bar moves and updates time
    audio.addEventListener("timeupdate", updateTime);
    // fires when song loads
		audio.addEventListener("loadedmetadata", updateDuration);

    //song ends
    audio.addEventListener("ended", handleEnded);

    // when current song is null (deleted) reset the times
    if(!currentSong){
      setCurrentTime(0);
      setDuration(0)
    }

    //cleanup
    return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
  },[currentSong])

  return (
    <footer className={`h-20 sm:h-24 bg-gradient-to-r ${gradientColor} px-4`}>
      {/* the audio component */}
      <audio ref={audioRef} />
      <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
        {/* currently playing song */}
        {(!isSmallScreen || currentSong) && 
        <div className='flex items-center gap-4 min-w-[180px] w-[30%]'>
          {currentSong && 
            <>
              <Music
                color="#002b80"
                className='w-8 h-8 sm:w-14 sm:h-14 object-cover rounded-md'
              />
              <div className='flex-1 min-w-0'>
                  <div className='font-medium max-md:text-sm truncate cursor-pointer'>
                    {currentSong.title}
                  </div>
                  <div className='text-sm max-md:text-xs text-zinc-400 truncate cursor-pointer'>
                    by {currentSong.artist.username}
                  </div>
                </div>
            </>
          }
        </div>
        }
        {/* player controls*/}
        <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Button
              size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack size={4} />
            </Button>
            <Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? 
              <Pause size={5} /> : 
              <Play size={5} />}
						</Button>
            <Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward size={4} />
						</Button>
          </div>
          <div className='hidden sm:flex items-center gap-2 w-full'>
						<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSeek}
						/>
						<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
					</div>
        </div>
        {/* volume controls */}
        <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
          <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
						<Volume1 size={4} />
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className='w-24 hover:cursor-grab active:cursor-grabbing'
            onValueChange={(value) => {
              setVolume(value[0]);
              if (audioRef.current) {
                audioRef.current.volume = value[0] / 100;
              }
            }}
          />
        </div>
      </div>
    </footer>
  )
}

export default AudioControls
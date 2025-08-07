import { ArrowLeft, Loader2, Music, Pause, Play } from 'lucide-react';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router';
import { useSearchStore } from '@/stores/useSearchStore';
import ErrorPage from './ErrorPage';
import { formatTime } from '@/utils/formatTime';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SongModel } from '@/models/Song';
import { useAudioPlayerStore } from '@/stores/useAudioPlayerStore';


const SongsByGenrePage = () => {
  const {genre} = useParams();
  const {songsByGenre, selectedGenre, setSelectedGenre, hasMoreSongs, isLoadingSongs, errorMessage, fetchSongsByGenre, clearSongs} = useSearchStore();
  const {currentSong, isPlaying, setCurrentSong, togglePlay, initializeQueue} = useAudioPlayerStore();
  const navigate =  useNavigate();

  // checks if songsByGenre song matches the genre category in order not to clear data and load again
  useEffect(() => {
    if(genre){
      if(selectedGenre?.id !== genre){
        setSelectedGenre(genre)
        clearSongs()
      }
    }
  },[genre])

  // when songs array changes re-initialize the song player queue
  useEffect(() => {
    if(songsByGenre.length > 0){
      initializeQueue(songsByGenre)
    }
  },[songsByGenre])

  const handlePlaySong = (song: SongModel) => {
    if(currentSong?._id === song._id) 
      togglePlay();
    else 
      setCurrentSong(song);
  }

  return (
    <div className="h-full">
      {errorMessage ?  <ErrorPage title={errorMessage} 
      description="Looks like songs got lost in shuffle. Let's get you back to the music."
      status="" /> : ''}
      {/* header */}
      <div className={`flex rounded-t-lg p-4 gap-4 bg-gradient-to-b ${selectedGenre?.gradientColor} via-zinc-800/20
					 to-zinc-900/80`}>
        <div className='flex flex-col w-full justify-end'>
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" onClick={() => {navigate(-1)}}/>
            <p className='text-sm font-medium'>Back to genre selection</p>
          </div>
          {/* genre name */}
          <h1 className='text-7xl font-bold mt-6 mb-4'>{selectedGenre?.value}</h1>
        </div>
      </div>
        <ScrollArea className='w-full bg-zinc-900/80 h-[calc(100dvh-296px)] sm:h-[calc(100dvh-318px)] rounded-b-lg'>
          {songsByGenre.map(song => (
            <div
            onClick={() => {navigate(`/songs/${song._id}`)}}
            key={song._id}
            className='flex px-2 items-center bg-transparent rounded-lg overflow-hidden
            hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
            >
              <Music
                color="#002b80"
                className={`w-8 sm:w-10 h-8 sm:h-10 object-cover flex-shrink-0 
                  ${currentSong?._id === song._id ? 'opacity-0' :'opacity-100 group-hover:opacity-25'}`}
              />
              <div onClick={e => {e.stopPropagation()}}>
                <Button
                  size='icon'
                  className={`relative right-8 rounded-full cursor-pointer bg-teal-500 hover:bg-teal-400 hover:scale-105 transition-all 
                    translate-y-2 group-hover:translate-y-0 ${
					          currentSong?._id === song._id ? "opacity-60" : "opacity-0 group-hover:opacity-60"}`}
                  onClick={() => {handlePlaySong(song)}}
                >
                  {currentSong?._id === song._id && isPlaying ? (
                    <Pause className='size-5 text-black' />
                  ) : (
                    <Play className='size-5 text-black' />
                  )}
                </Button>
              </div>
              <div className='flex-1 p-4'>
                <p className='font-medium truncate'>{song.title}</p>
                <p className='text-sm text-zinc-400 truncate'>by {song.artist.username}</p>
              </div>
              <p className='text-sm text-zinc-400 '>{formatTime(song.durationInSec)}</p>
            </div>
          ))}
          <InfiniteScroll hasMore={hasMoreSongs} isLoading={isLoadingSongs} next={() => {fetchSongsByGenre(genre as string)}} threshold={0.4}>
          {hasMoreSongs && <div className='flex justify-center items-center'><Loader2 className="my-4 h-8 w-8 animate-spin" /></div>}
          </InfiniteScroll>
        </ScrollArea>
    </div>
  );
};

export default SongsByGenrePage;

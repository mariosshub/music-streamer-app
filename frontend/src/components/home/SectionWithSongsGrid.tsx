import { Music } from "lucide-react";
import SectionWithSongsLoading from "../loadingViews/SectionWithSongsLoading";
import PlayButton from "./PlayButton";
import { SongModel } from "@/models/Song";
import EmptyBox from "../loadingViews/EmptyBox";
import { useNavigate } from "react-router";
import getMinutesDiferrence from "@/utils/getMinutesDifference";

type SectionGridProps = {
  sectionId: string;
  title: string;
  songs: SongModel[];
  isLoading: boolean
}

const SectionWithSongsGrid = ({sectionId, title, songs, isLoading}: SectionGridProps) => {
  const navigate = useNavigate();
  if(isLoading) return <SectionWithSongsLoading />
  return (
    <div className="mb-8">
      <h2 className='sm:text-xl font-bold mb-4'>{title}</h2>
      {songs.length == 0  ? <EmptyBox title= {title + " don't exist yet"} description="" icon={<Music className="w-6 h-6"/>} /> : ''}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>  
        {songs.map((song) => (
          <div
            onClick={() => {navigate(`/songs/${song._id}`)}}
            key={song._id}
            className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
          hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
          >
            <Music
              color="#002b80"
              className='w-16 sm:w-18 h-16 sm:h-18 object-cover flex-shrink-0'
            />
            <div className='flex-1 p-4'>
              <p className='font-medium truncate'>{song.title}</p>
              <p className='text-sm text-zinc-400 truncate'>by {song.artist.username}</p>
              {sectionId === "recently_uploaded" ? <i className="text-sm text-zinc-400 truncate">
                {getMinutesDiferrence(song.uploadDate) === 0 ? "just now" : getMinutesDiferrence(song.uploadDate) + " minutes ago"}</i> : ""}
            </div>
            <div onClick={e => {e.stopPropagation()}}> 
              <PlayButton song={song} sectionId={sectionId}/>
            </div>
          </div>
        ))}
		  </div>
    </div>
  )
}

export default SectionWithSongsGrid
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Filter, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchStore } from "@/stores/useSearchStore";
import ErrorPage from "@/pages/ErrorPage";
import { ScrollArea } from "../ui/scroll-area";
import InfiniteScroll from "../ui/infinite-scroll";
import { useNavigate } from "react-router";


const DiscoverAlbums = () => {
  const {allAlbums, isLoadingAlbums, hasMoreAlbums, albumFilter, artistFilter, errorMessage, searchAlbums, clearAlbums, setAlbumFilter, setArtistFilter} = useSearchStore();
  const navigate = useNavigate();
  const albumSearchValue = useDebouncedValue(albumFilter, 600)
  const artistSearchValue = useDebouncedValue(artistFilter, 600)

  useEffect(() => {
    clearAlbums();
    searchAlbums(albumSearchValue, artistSearchValue);
  },[albumSearchValue, artistSearchValue])

  return (
    <div className="p-4">
      {errorMessage ?  <ErrorPage title={errorMessage} 
      description="Looks like albums got lost in creativity. Let's get you back to the music."
      status="" /> : ''}
      <div className="flex justify-between py-1 border-b border-b-zinc-700/40">
        <h2 className='text-lg sm:text-xl font-bold mb-4'>All users albums</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
               <Button 
                size='icon' 
                className="w-10 h-10 rounded-full cursor-pointer bg-teal-500 hover:bg-teal-400 hover:scale-105 transition-all"
              >
                <Filter className="w-6 h-6 text-black" />
              </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-center">Filter albums</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-2 flex items-center">
                <label className='text-sm font-medium flex-2/5'>Album title: </label>
                <Input className="flex-3/5" placeholder="title" value={albumFilter} onChange={(e) => {setAlbumFilter(e.target.value)}}/>
              </div>
              <div className="pb-2 flex items-center">
                <label className='text-sm font-medium flex-2/5'>User: </label>
                <Input className="flex-3/5" placeholder="username" value={artistFilter} onChange={(e) => {setArtistFilter(e.target.value)}}/>
              </div>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-296px)] rounded-b-lg">
        {allAlbums.map(album => (
          <div
            onClick={() => {navigate(`/albums/${album._id}`)}}
            key={album._id}
            className='flex flex-col p-4 bg-transparent rounded-lg overflow-hidden
            hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
          >
            <p className='font-medium text-lg truncate'>{album.title}</p>
            <div className="flex items-center gap-2 ml-1 text-sm text-zinc-400 truncate">
              <span>• by {album.artist.username}</span>
              <span>• produced in {album.releasedYear}</span>
              <span>• {album.songs.length > 0 ? album.songs.length + ' songs' : 'no songs'}</span>
            </div>
          </div>
        ))}
        <InfiniteScroll hasMore={hasMoreAlbums} isLoading={isLoadingAlbums} next={() => {searchAlbums(albumSearchValue, artistSearchValue)}} threshold={0.4}>
            {hasMoreAlbums && <div className='flex justify-center items-center'><Loader2 className="my-4 h-8 w-8 animate-spin" /></div>}
        </InfiniteScroll>
      </ScrollArea>
    </div>

  )
}

export default DiscoverAlbums
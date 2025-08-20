import AddSongDialog from "@/components/dialogs/AddSongDialog";
import DeleteConfirmationDialog from "@/components/dialogs/DeleteConfirmationDialog";
import EditSongDialog from "@/components/dialogs/EditSongDialog";
import RenameAlbumDialog from "@/components/dialogs/RenameAlbumDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/AuthProvider";
import { useMusicStore } from "@/stores/useMusicStore"
import { formatTime } from "@/utils/formatTime";
import { ArrowLeft, ArrowUpRight, Disc3, Edit2, Pause, Play, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router"
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { mapMusicGenres } from "@/utils/mapMusicGenres";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { EditSongModel } from "@/models/Song";

const AlbumsPage = () => {
  const {albumId} = useParams();
  const {fetchAlbumByIdPopulatedSongs, fetchUsersAlbums, currentAlbum, albumSongs, isLoading, errorMessage} = useMusicStore();
  const {currentSong, isPlaying, playAlbum, togglePlay} = useAudioPlayerStore();
  const {loggedInUser} = useAuth();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();

  useEffect(()=> {
    if(albumId) fetchAlbumByIdPopulatedSongs(albumId);
  },[albumId])

  // check if is owner of album
  const checkIsAlbumOwner = () => {
    if(currentAlbum){
      return currentAlbum.artist._id == loggedInUser?._id;
    }
    return false;
  }

  const handleReloadAlbum = () => {
    if(albumId)
      fetchAlbumByIdPopulatedSongs(albumId);
  }
  
  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

		const isCurrentAlbumPlaying = albumSongs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// start playing the album from the beginning
			playAlbum(albumSongs, 0);
		}
  }

  const handlePlaySong = (index: number) => {
    if(!currentAlbum) return;
    playAlbum(albumSongs, index);
  }

  const updateSongDetails = (editedSong: EditSongModel) => {
    if(albumId) {
      // check if song moved to other album
      if(albumId !== editedSong.album){
        // update the album list
        fetchUsersAlbums();
        // update the current album
        fetchAlbumByIdPopulatedSongs(albumId);
      }
      else{
        fetchAlbumByIdPopulatedSongs(albumId)
      }
    }
  }

  if(isLoading){
    return <LoadingPage />
  }
  return (
    <div className='h-full'>
      {errorMessage ?  <ErrorPage title={errorMessage} 
      description="Looks like this album got lost in creativity. Let's get you back to the music."
      status="" /> : ''}
      <ScrollArea className='h-full rounded-md'>
        {/* Main Content */}
        <div className='relative min-h-full'>
          {/* bg gradient */}
          <div
						className='absolute inset-0 bg-gradient-to-b from-[#005f5a]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>
          {/*Album Content */}
          <div className='relative z-10'>
            <div className='flex p-6 gap-6 pb-8'>
              <div className='flex flex-col w-full justify-end'>
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" onClick={() => {navigate(-1)}}/>
								  <p className='text-sm font-medium'>Album {currentAlbum?.isDefault ? '(default)' : ''}</p>
                </div>   
								<h1 className='wrap-normal text-5xl sm:text-7xl font-bold my-4'>{currentAlbum?.title}</h1>
								<div className='flex flex-col sm:flex-row sm:flex-wrap sm:justify-between pt-6 gap-4'>
                  <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 text-sm text-zinc-100">
                    <span className='font-medium text-white'>• Created by {checkIsAlbumOwner() ? 'you' : currentAlbum?.artist.username}</span>
                    <span>• Released in {currentAlbum?.releasedYear}</span>
                    <span>• {albumSongs.length} songs</span>
                  </div>
                  <div className="flex items-center gap-4 text-s">
                    {checkIsAlbumOwner() && currentAlbum?._id &&
                      <RenameAlbumDialog albumId={currentAlbum._id} title={currentAlbum.title}>
                        <span className="cursor-pointer text-blue-600 hover:underline">Rename album</span>
                      </RenameAlbumDialog>
                    }
                    {checkIsAlbumOwner() && !currentAlbum?.isDefault && currentAlbum?._id &&
                      <DeleteConfirmationDialog
                            id={currentAlbum._id}
                            desc={
                              <>
                                <span>This album and all it's songs will be deleted.</span>
                                <br/>
                                <span>This action cannot be reversed and might take some time depending on the size of the list</span>
                              </>
                            }
                            action="delete_album"
                      >
                        <span className="cursor-pointer text-red-600 hover:underline">Delete album</span>
                      </DeleteConfirmationDialog>
                    }
                  </div>
								</div>
							</div>
            </div>
            {/* play button */}
            <div className='px-6 pb-4 flex items-center gap-6'>
              <Button 
                size='icon' 
                className="w-14 h-14 rounded-full cursor-pointer bg-teal-500 hover:bg-teal-400 hover:scale-105 transition-all"
                onClick={handlePlayAlbum}
              >
                {isPlaying && albumSongs.some((song) => song._id === currentSong?._id) ?
                  <Pause className='h-7 w-7 text-black' /> :
                  <Play className='h-7 w-7 text-black' />
                }
              </Button>
              {isSmallScreen && checkIsAlbumOwner() &&
              <AddSongDialog reloadAlbum={handleReloadAlbum} albumId={albumId}>
                <Button 
                size='icon' 
                className="w-14 h-14 rounded-full cursor-pointer bg-teal-500 hover:bg-teal-400 hover:scale-105 transition-all"
                >
                  <Plus className=' font-bold h-7 w-7' />
                </Button>
              </AddSongDialog>
              }
            </div>
            {/* add song button */}
            {!isSmallScreen && checkIsAlbumOwner() && 
              <div className="flex justify-end">
                <AddSongDialog reloadAlbum={handleReloadAlbum} albumId={albumId}>
                  <Button className='bg-teal-500 hover:bg-teal-600 text-black text-sm cursor-pointer'>
					          <Plus className='mr-2 h-4 w-4' />
					          Add Song
				          </Button>
                </AddSongDialog>
              </div>   
            } 

            {/* Card section if is mobile screen*/}

            {isSmallScreen && 
            <div>
              {albumSongs.map((song,index) => (
                <div
                onClick={() => {navigate(`/songs/${song._id}`)}}
                key={song._id}
                className='flex px-2 items-center bg-transparent rounded-lg border-b border-zinc-800 overflow-hidden
                hover:bg-zinc-700/50 transition-colors cursor-pointer relative'
                >
                  <Disc3
                    color="#002b80"
                    style={{animationDuration: '3s'}}
                    className={`w-8 h-8 object-cover flex-shrink-0 animate-spin
                      ${currentSong?._id === song._id  && isPlaying? 'opacity-100' :'opacity-0'}`}
                  />
                  
                  <div onClick={e => {e.stopPropagation()}}>
                    <Button
                      size='icon'
                      className={`relative right-8 rounded-full cursor-pointer bg-teal-500 
                        translate-y-2 ${
                        currentSong?._id !== song._id || !isPlaying ? "opacity-100" : "opacity-0"}`}
                      onClick={() => {handlePlaySong(index)}}
                    >
                      <Play className='size-4 text-black' />
                    </Button>
                  </div>
                  <div className='flex-1 p-4'>
                    <p className='font-medium truncate'>{song.title}</p>
                    <p className='text-sm text-zinc-400 truncate'>{song.genre}</p>
                  </div>
                  <p className='text-sm text-zinc-400 '>{formatTime(song.durationInSec)}</p>
                </div>
              ))}
            </div>}

            {/* Table Section if is big screen */}

            {!isSmallScreen && 
            <ScrollArea className='bg-black/20 backdrop-blur-sm h-[calc(100vh-490px)]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Released date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Likes</TableHead>
                    {checkIsAlbumOwner() && <TableHead>Actions</TableHead> }
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {albumSongs.map((song, index) => (
                    <TableRow key={song._id} onClick={() => {handlePlaySong(index)}} className="h-8 hover:bg-teal-950 group">
                      <TableCell className="w-10">
                        {isPlaying && currentSong?._id === song._id ?
                          <Disc3 className='size-4 text-teal-600 animate-spin' style={{animationDuration: '3s'}} /> :
                          index + 1
                        }
                      </TableCell>
                      <TableCell>{song.title}</TableCell>
                      <TableCell>{new Date(song.releasedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{formatTime(song.durationInSec)}</TableCell>
                      <TableCell>{mapMusicGenres(song.genre)?.value}</TableCell>
                      <TableCell>{song.votes}</TableCell>
                      <TableCell className="w-20">
                        <div className='flex gap-2 justify-end'>
                          {checkIsAlbumOwner() && 
                            // added this div to stop the propagation of clicking anywhere in the dialog..
                            // maybe there is a better way but this just worked eventually..
                            <div onClick={e => {e.stopPropagation()}}>
                              <Tooltip>
                                <TooltipTrigger className="cursor-pointer">
                                  <EditSongDialog song={song} updateSongDetails={updateSongDetails}>
                                    <Edit2 onClick={e => {e.stopPropagation()}} className="size-4 hover:animate-pulse" color="blue" fill="blue" />
                                  </EditSongDialog>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit song</p></TooltipContent>
                              </Tooltip>
                            </div>
                          }
                          {checkIsAlbumOwner() && 
                            <div onClick={e => {e.stopPropagation()}}>
                              <Tooltip>
                                <TooltipTrigger className="cursor-pointer">
                                  <DeleteConfirmationDialog
                                  id={song._id}
                                  desc={<span>The song will be deleted permanetly from this album</span>}
                                  action="delete_song"
                                  >
                                    <Trash2 className="size-4 hover:animate-pulse" color="red"/>
                                  </DeleteConfirmationDialog>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete song</p></TooltipContent>
                              </Tooltip>   
                            </div>
                          }
                          <div onClick={e => {e.stopPropagation()}}>
                            <Tooltip>
                              <TooltipTrigger className="cursor-pointer">
                                <Link to={`/songs/${song._id}`}>
                                  <ArrowUpRight className="size-4 hover:animate-pulse text-teal-600" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent><p>Expand song details</p></TooltipContent>
                            </Tooltip> 
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            }
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AlbumsPage
import { EditSongModel, SongModel, SongWithCommentsModel } from "@/models/Song";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useMusicStore } from "@/stores/useMusicStore";
import { checkErrors } from "@/utils/checkErrors";
import { PropsWithChildren, useActionState, useState } from "react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { axiosInstance } from "@/lib/axios";
import useCustomizedToast from "@/hooks/useCustomizedToast";
import { musicGenres } from "@/utils/music-genres.data";

export type Props = {
  song: SongModel | SongWithCommentsModel,
  albumId: string | undefined;
}

const EditSongDialog = ({song, albumId, children}:PropsWithChildren<Props>) => {
  const {albums, fetchAlbumByIdPopulatedSongs, fetchUsersAlbums } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const {toastSuccess, toastErrorApi} =  useCustomizedToast();

  const [editSongModel, setEditSongModel] = useState<EditSongModel>({
    releasedDate: new Date(song.releasedDate),
    genre: song.genre,
    album: song.album
  })

  const handleClose = (open: boolean) => {
    setSongDialogOpen(open)
    if(!open){
      formState.errors = null;
      setEditSongModel({
        releasedDate: new Date(song.releasedDate),
        genre: song.genre,
        album: song.album
      })
    }
  }

  const handleCancel = (e:any) => {
    e.preventDefault(); 
    setEditSongModel({
      releasedDate: new Date(song.releasedDate),
      genre: song.genre,
      album: song.album
    })
    formState.errors = null; 
    setSongDialogOpen(false)
  }

  const handleSubmit = async() => {    
    let errors = {
      releasedDate: "",
      genre: "",
      album: ""
    };

    if(!editSongModel.genre || editSongModel.genre.length == 0){
      errors.genre = "* You should select a genre"
    }

    if(!editSongModel.releasedDate || editSongModel.releasedDate.toISOString() == "Invalid Date"){
      errors.releasedDate = "* Please choose a valid date"
    }
    else if(editSongModel.releasedDate > new Date()) {
      errors.releasedDate = "* Please choose a previous date or current"
    }

    if(!editSongModel.album || editSongModel.album.length == 0){
      errors.album = "*Please select an album"
    }

    //check for errors
    if(checkErrors(errors))
      return {errors}

    try{
      await axiosInstance.put(`/songs/${song._id}`, editSongModel);
      setSongDialogOpen(false);
      toastSuccess("Song edited!")
      // check if song moved to other album
      if(song.album !== editSongModel.album){
        fetchUsersAlbums();
        if(albumId)
          fetchAlbumByIdPopulatedSongs(albumId);
      }
      else{
        if(albumId)
          fetchAlbumByIdPopulatedSongs(albumId)
      }
    } catch (error: any) {
      toastErrorApi(error)
    }
    return {errors: null}
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {errors: null})

  return (
    <Dialog open={songDialogOpen} onOpenChange={(open) => {handleClose(open)}}>
      <DialogTrigger asChild>
				{children}
			</DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-auto'>
        <DialogHeader>
					<DialogTitle>Edit song</DialogTitle>
					<DialogDescription>Edit the details of "{song.title}"</DialogDescription>
				</DialogHeader>
        <form action={formAction}>
          <div className='space-y-4 py-4'>
            <div className="flex flex-col gap-3">
              <label className='text-sm font-medium px-1'>Released date</label>
              <div className="relative flex gap-2">
                <Input
                  id="date"
                  value={editSongModel.releasedDate?.toLocaleDateString()}
                  className={`${formState.errors?.releasedDate ? 'bg-red-700' : 'bg-zinc-700'} pr-10`}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    console.log(date);
                    if(date){
                      setEditSongModel({...editSongModel, releasedDate: date})
                    }
                  }}
                />
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={editSongModel.releasedDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if(date)
                          setEditSongModel({...editSongModel, releasedDate: date})
                        setDatePickerOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-red-600 text-sm font-thin">{formState.errors?.releasedDate}</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Genre</label>
              <Select
                value={editSongModel.genre}
                name="genre"
                onValueChange={(value) => setEditSongModel({ ...editSongModel, genre: value })}
              >
                <SelectTrigger className={`bg-zinc-800 ${formState.errors?.genre ? 'border-red-700' : 'border-zinc-700'}`}>
                  <SelectValue placeholder='Select genre' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-800 border-zinc-700'>
                 {musicGenres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-600 text-sm font-thin">{formState.errors?.genre}</p>
            </div>
         
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Album</label>
              <Select
                name="album"
                value={editSongModel.album}
                onValueChange={(value) => setEditSongModel({ ...editSongModel, album: value })}
              >
                <SelectTrigger className={`${formState.errors?.album ? 'bg-red-700' : 'bg-zinc-700'} border-zinc-700`}>
                  <SelectValue placeholder='Select album' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-800 border-zinc-700'>
                  {albums.map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-600 text-sm font-thin">{formState.errors?.album}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={(e) => handleCancel(e)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Editting..." : "Edit song"}
            </Button>
          </DialogFooter>
        </form>   
      </DialogContent>
    </Dialog>
  )
}

export default EditSongDialog
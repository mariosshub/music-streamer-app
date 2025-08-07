import { CreateSongModel } from "@/models/Song";
import { useMusicStore } from "@/stores/useMusicStore"
import { PropsWithChildren, useActionState, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { setAudioDuration } from "@/utils/setAudioDuration";
import useCustomizedToast from "@/hooks/useCustomizedToast";
import { axiosInstance } from "@/lib/axios";
import { checkErrors } from "@/utils/checkErrors";
import { musicGenres } from "@/utils/music-genres.data";

type Props = {
  reloadAlbum: undefined | (() => void),
  albumId: string | undefined
}

const AddSongDialog = ({reloadAlbum, albumId, children}:PropsWithChildren<Props>) => {
  const {albums } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const {toastSuccess, toastErrorApi} = useCustomizedToast();

  const [newSong, setNewSong] = useState<CreateSongModel>({
    title: "",
    releasedDate: new Date(),
    durationInSec: "0",
    album: "",
    genre: ""
  })

  const [audioFile, setAudioFile] = useState<File | null>(null)
  const audioInputRef = useRef<HTMLInputElement>(null);

  // if albumId exists set the album as default selected for select
  useEffect(() => {
    if(albumId){
      setNewSong({ ...newSong, album: albumId })
    }
  },[])

  const cleanFields = () => {
    setNewSong({
        title: "",
        releasedDate: new Date(),
        durationInSec: "0",
        album: "",
        genre: ""
      });
    setAudioFile(null)
  }

  const handleClose = (open: boolean) => {
    setSongDialogOpen(open)
    if(!open){
      cleanFields();
      formState.errors = null; 
    }
  }

  const handleCancel = (e:any) => {
    e.preventDefault(); 
    cleanFields();
    formState.errors = null; 
    setSongDialogOpen(false)
  }

  const handleSubmit = async() => {    
    let errors = {
      file: "",
      title: "",
      releasedDate: "",
      genre: "",
      album: ""
    };

    if (!audioFile || audioFile.size == 0){
      errors.file = "* You should upload a file";
    }
    
    if(!newSong.title || newSong.title.length == 0){
      errors.title =  "* You should provide a title"
    }

    if(!newSong.genre || newSong.genre.length == 0){
      errors.genre = "* You should select a genre"
    }

    if(!newSong.releasedDate || newSong.releasedDate.toISOString() == "Invalid Date"){
      errors.releasedDate = "* Please choose a valid date"
    }
    else if(newSong.releasedDate > new Date()) {
      errors.releasedDate = "* Please choose a previous date or current"
    }

    if(!newSong.album || newSong.album.length == 0){
      if(albums.length == 0)
        newSong.album = "0";
      else{
        errors.album = "*Please select an album"
      }
    }

    //check for errors
    if(checkErrors(errors))
      return {errors}

    // set the formData
    let formData = new FormData();
    if(audioFile)
      formData.append('file', audioFile)
    formData.append('durationInSec',newSong.durationInSec)
    formData.append('title',newSong.title)
    formData.append('releasedDate',newSong.releasedDate.toISOString())
    formData.append('genre',newSong.genre)
    formData.append('album',newSong.album)

    try {
      await axiosInstance.post("/songs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      cleanFields();
      if(reloadAlbum){
        reloadAlbum();
      }
      setSongDialogOpen(false);
      toastSuccess("Song added successfully");
      return {errors: null};
    } catch (error: any) {
      toastErrorApi(error)
      return {errors: null};
    } finally {
      return {errors: null};
    }
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {errors: null})

  return (
    <Dialog open={songDialogOpen} onOpenChange={(open) => {handleClose(open)}}>
      <DialogTrigger asChild>
				{children}
			</DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-auto'>
        <DialogHeader>
					<DialogTitle>Add new song</DialogTitle>
					<DialogDescription>Add a new song to your music library</DialogDescription>
				</DialogHeader>
        <form action={formAction}>
          <div className='space-y-4 py-4'>
          <input
						type='file'
						accept='audio/*'
            name="file"
						ref={audioInputRef}
						hidden
						onChange={(e) => {
              let file = e.target.files![0];
              if(file){
                setAudioFile(file);
                setAudioDuration(file, newSong, setNewSong);
              }  
            }}
					/>
          {/* audio upload component */}
          <div className='space-y-2'>
						<label className='text-sm font-medium'>Audio File</label>
						<div className='flex items-center gap-2'>
							<Button variant='outline' 
                onClick={(e) => {e.preventDefault();audioInputRef.current?.click()}} 
                className={`w-full ${formState.errors?.file ? 'border-red-700' : ''}`}>
								{audioFile ? audioFile.name.slice(0, 20)+ " duration: "+ newSong.durationInSec+ "s" : "Choose Audio File"}
							</Button>
						</div>
            <p className="text-red-600 text-sm font-thin">{formState.errors?.file}</p>
					</div>
          <div className='space-y-2'>
						<label className='text-sm font-medium'>Title</label>
						<Input
							value={newSong.title}
              name="title"
							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
							className={`bg-zinc-800 ${formState.errors?.title ? 'border-red-700' : 'border-zinc-700' }`}
						/>
            <p className="text-red-600 text-sm font-thin">{formState.errors?.title}</p>
					</div>
          <div className='space-y-2'>
						<label className='text-sm font-medium'>Genre</label>
            <Select
							value={newSong.genre}
              name="genre"
							onValueChange={(value) => setNewSong({ ...newSong, genre: value })}
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
          <div className="flex flex-col gap-3">
            <label className='text-sm font-medium px-1'>Released date</label>
            <div className="relative flex gap-2">
              <Input
                id="date"
                value={newSong.releasedDate?.toLocaleDateString()}
                className={`${formState.errors?.releasedDate ? 'bg-red-700' : 'bg-zinc-700'} pr-10`}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  console.log(date);
                  if(date){
                    setNewSong({...newSong, releasedDate: date})
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
                    selected={newSong.releasedDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if(date)
                        setNewSong({...newSong, releasedDate: date})
                      setDatePickerOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-red-600 text-sm font-thin">{formState.errors?.releasedDate}</p>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Album</label>
            <Select
              name="album"
							value={newSong.album}
							onValueChange={(value) => setNewSong({ ...newSong, album: value })}
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
						{isPending ? "Uploading..." : "Add song"}
					</Button>
				</DialogFooter>
        </form>   
      </DialogContent>
    </Dialog>
  )
}

export default AddSongDialog
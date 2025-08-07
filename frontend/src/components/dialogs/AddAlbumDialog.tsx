import { ReactNode, useActionState, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { checkErrors } from "@/utils/checkErrors";
import { CreateAlbum } from "@/models/Album";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";

type Props = {
  children: ReactNode
}

const AddAlbumDialog = ({children}:Props) => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const {fetchUsersAlbums} = useMusicStore();

   const handleClose = (open: boolean) => {
    setAlbumDialogOpen(open)
    if(!open){
      formState.errors = null; 
    }
  }

  const handleCancel = (e:any) => {
    e.preventDefault(); 
    formState.errors = null; 
    setAlbumDialogOpen(false)
  }

  const handleSubmit = async(_:any, formData:FormData) => {
    const albumTitle = formData.get('title')?.toString();
    const releasedYear = formData.get('releasedYear')?.toString();

    let errors = {
      title: "",
      releasedYear: ""
    }

    if(!albumTitle || albumTitle.length == 0)
      errors.title = "* You should provide a title"
    
    if(!releasedYear || releasedYear.length == 0)
      errors.releasedYear = "* Please provide a released year"

    if(checkErrors(errors))
      return {errors, enteredValues: {
        title: albumTitle,
        releasedYear: releasedYear
      }}

    let createAlbum:CreateAlbum = {
      title: albumTitle as string,
      releasedYear: parseInt(releasedYear as string)
    }

    try{
      await axiosInstance.post<CreateAlbum>("/albums/create", createAlbum)
      setAlbumDialogOpen(false);
      fetchUsersAlbums();
      return {errors: null}
    }catch(error: any){
      return{errors: null}
    }finally{
      return {errors: null}
    }
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {errors: null})

  return (
    <Dialog open={albumDialogOpen} onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add new album</DialogTitle>
					<DialogDescription>Add a new album to your collection</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Title</label>
              <Input
                defaultValue={formState.enteredValues?.title}
                name="title"
                className={`bg-zinc-800 ${formState.errors?.title ? 'border-red-700' : 'border-zinc-700' }`}
              />
              <p className="text-red-600 text-sm font-thin">{formState.errors?.title}</p>
					  </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Released year</label>
              <Input
                defaultValue={formState.enteredValues?.releasedYear ? formState.enteredValues.releasedYear : new Date().getFullYear()}
                type="number"
                name="releasedYear"
                min={1900}
                max={new Date().getFullYear()}
                className={`bg-zinc-800 ${formState.errors?.releasedYear ? 'border-red-700' : 'border-zinc-700' }`}
              />
              <p className="text-red-600 text-sm font-thin">{formState.errors?.releasedYear}</p>
					  </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={(e) => handleCancel(e)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Add album"}
            </Button>
				  </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog
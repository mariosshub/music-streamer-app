import { PropsWithChildren, useActionState, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMusicStore } from "@/stores/useMusicStore";

type Props = {
  albumId: string,
  title: string
}

const RenameAlbumDialog = ({albumId, title, children}:PropsWithChildren<Props>) => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const {renameAlbum} = useMusicStore();
  
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

    let errors = {
      title: ""
    }

    if(!albumTitle || albumTitle.length == 0)
      errors.title = "* You should provide a title"

    if(albumTitle == title)
      errors.title = "* Name a different title"

    if(errors.title.length > 0)
      return {errors, enteredValues: {
        title: albumTitle,
      }}

    if(albumTitle)
      await renameAlbum(albumId, albumTitle);

    return {errors: null};
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {errors: null})

  return (
    <Dialog open={albumDialogOpen} onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Rename album</DialogTitle>
                    <DialogDescription>Rename the album's title</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Title</label>
              <Input
                defaultValue={formState.enteredValues?.title ? formState.enteredValues?.title : title}
                name="title"
                className={`bg-zinc-800 ${formState.errors?.title ? 'border-red-700' : 'border-zinc-700' }`}
              />
              <p className="text-red-600 text-sm font-thin">{formState.errors?.title}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={(e) => handleCancel(e)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update album"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RenameAlbumDialog
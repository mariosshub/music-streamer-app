import { PropsWithChildren, ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNavigate } from "react-router";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";


type Props = {
  id: string,
  desc: ReactNode,
  action: string
}

const DeleteConfirmationDialog = ({id, desc, action, children}:PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {deleteSong, deleteAlbum} = useMusicStore();
  const {clearPlayer} = useAudioPlayerStore();


  const deleteHandler = async() => {
    switch (action) {
      case "delete_song":
        await deleteSong(id);
        // just clear the audio player for now
        // (checking for playing song in queue and updating the list accordingly is too complex)
        clearPlayer();    
        break;
      case "delete_album":
        await deleteAlbum(id);
        clearPlayer();
        navigate("/home");
        break;
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            {desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => deleteHandler()} >Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteConfirmationDialog

export default DeleteConfirmationDialog
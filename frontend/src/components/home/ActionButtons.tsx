import { Library, ListMusic } from "lucide-react"
import AddSongDialog from "../dialogs/AddSongDialog"
import AddAlbumDialog from "../dialogs/AddAlbumDialog"

const ActionButtons = () => {
  return (
    <div className="mb-6 flex flex-wrap justify-start gap-6">
      <AddAlbumDialog>
        <div className="flex items-center gap-2 bg-zinc-800/50 border-zinc-700/50 rounded-md hover:bg-zinc-700/50 transition-colors p-4 cursor-pointer ">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Library className="text-cyan-700 size-6 rounded-md"/>
          </div>
          <div className='flex-1'>
            <p className="text-sm font-bold">Create new album</p>
          </div>
        </div>
      </AddAlbumDialog>
      <AddSongDialog reloadAlbum={undefined} albumId={undefined}>
        <div className="flex items-center gap-2 bg-zinc-800/50 border-zinc-700/50 rounded-md hover:bg-zinc-800/80 transition-colors p-4 cursor-pointer ">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <ListMusic className="text-teal-700 size-6 rounded-md"/>
          </div>
          <div className='flex-1'>
            <p className="text-sm font-bold">Add new song</p>
          </div>
        </div>
      </AddSongDialog>
      
    </div>
  )
}

export default ActionButtons
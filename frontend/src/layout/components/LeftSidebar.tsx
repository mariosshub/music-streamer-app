import AlbumsList from "@/components/albums/AlbumsList"
import PlaylistLoading from "@/components/loadingViews/PlaylistLoading"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMusicStore } from "@/stores/useMusicStore"
import { BookHeadphones, Compass, HomeIcon } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router"

const LeftSidebar = () => {
  const { albums, fetchUsersAlbums, isLoading} = useMusicStore();

  useEffect(() => {
    fetchUsersAlbums();
  }, [fetchUsersAlbums])

  return (
    <div className='h-full flex flex-col gap-2'>
      {/* Navigation */}
      <div className='rounded-lg bg-zinc-900 p-2 md:p-4'>
        <div className='space-y-2'>
          <Link to={"/home"} 
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start text-white hover:bg-zinc-800 hover:text-white",
							  })
						  )}
					>
            <HomeIcon className='mr-2 size-5' />
            <span className='hidden md:inline'>Home</span>
          </Link>
        </div>
        <div className='space-y-2'>
          <Link to={"/discover"} 
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start text-white hover:bg-zinc-800 hover:text-white",
							  })
						  )}
					>
            <Compass className='mr-2 size-5' />
            <span className='hidden md:inline'>Discover</span>
          </Link>
        </div>
      </div>
      {/* Albums */}

      <div className='flex-1 rounded-lg bg-zinc-900 p-2 md:p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <BookHeadphones className='mr-2 size-5' />
            <span className='hidden md:inline'>My albums</span>
          </div>
        </div>
        <ScrollArea className='h-[calc(100vh-286px)] md:h-[calc(100vh-338px)]'>
          <div className='space-y-2'>
            {isLoading ? <PlaylistLoading /> : 
              <AlbumsList albums={albums}/> 
            }
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default LeftSidebar
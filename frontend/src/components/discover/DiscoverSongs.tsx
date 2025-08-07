import { ScrollArea } from "@/components/ui/scroll-area"
import ErrorPage from "@/pages/ErrorPage"
import LoadingPage from "@/pages/LoadingPage"
import { useSearchStore } from "@/stores/useSearchStore"
import { useEffect } from "react"
import { useNavigate } from "react-router"

const DiscoverSongs = () => {
  const {songGenres, isLoading, errorMessage, fetchSongGenres} = useSearchStore();
  const navigate = useNavigate();

  useEffect(() => {
    // load only once
    if(!songGenres || songGenres.length == 0)
      fetchSongGenres();
  },[songGenres, fetchSongGenres])


  if(isLoading)
    return <LoadingPage />

  return (
    <div className="p-4">
      {errorMessage ?  <ErrorPage title={errorMessage} 
      description="Looks like songs got lost in shuffle. Let's get you back to the music."
      status="" /> : ''}
      <h2 className='text-lg sm:text-xl font-bold pb-2 mb-4 border-b border-b-zinc-700/40'>All song categories</h2>
      <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-296px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
          {
            songGenres.map((item) => (
              <div onClick={() => {navigate(`/discover/genre/${item.id}`)}} key={item.id} 
                className={`p-4 m-2 h-16 rounded-xl flex items-center justify-center cursor-pointer ${item.bgColor}`}>
                <h2 className="text-xl text-center truncate">{item.value}</h2>
              </div>
            ))
          }
        </div>
      </ScrollArea>
    </div>
  )
}

export default DiscoverSongs
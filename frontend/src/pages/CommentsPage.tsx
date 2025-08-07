import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/providers/AuthProvider";
import { useSongCommentsStore } from "@/stores/useSongCommentsStore"
import { ArrowLeft, MessageCircleMore, UserCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import LoadingPage from "./LoadingPage";
import CommentsInput from "@/components/comments/CommentsInput";
import EmptyBox from "@/components/loadingViews/EmptyBox";
import ErrorPage from "./ErrorPage";

const CommentsPage = () => {
  const {songId} = useParams();
  const {fetchSongWithComments, songWithComments, isLoading, errorMessage} = useSongCommentsStore();
  const navigate = useNavigate();
  const {loggedInUser} = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // check if songWithComments exist and data are loaded for the selected song in order not to fetch again
  useEffect(() => {
    if(songId){
      if(!songWithComments || songWithComments._id !== songId)
        fetchSongWithComments(songId);
    } 
  }, [songId])

  // scroll to the last comment when the comments get updated
  useEffect(() => {
    // Get the scroll viewport from the ScrollArea component
    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [songWithComments?.comments])

  const userIsAuthor = (userId:string) => {
    return userId == loggedInUser?._id;
  }

  if(isLoading){
    return <LoadingPage />
  }

  return (
    <main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
      {errorMessage ?  <ErrorPage title={errorMessage} 
      description="Looks like you are so famous that comments left the chat. Let's get you back on track."
      status="" /> : ''}
      <div className='flex flex-col h-full'>
        <div className='p-2 border-b border-zinc-700'>
          <div className='flex flex-col items-center gap-2'>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" onClick={() => {navigate(-1)}}/>
              <p className='font-medium'>Comments</p>
            </div> 
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-200">
              <span>{songWithComments?.title}</span>
              <span>• Created by {songWithComments?.artist.username}</span>
              <span>• {songWithComments?.comments.length} people commented</span>
            </div>
          </div>
		    </div>
        {/* Messages */}
        {songWithComments?.comments.length == 0 ?
          <EmptyBox 
          title="No comments exist" 
          description="Start by typing one!" 
          icon= {<MessageCircleMore className="w-18 h-18" />}
          /> 
          : 
          <ScrollArea className='h-[calc(100vh-268px)]' ref={scrollAreaRef}>
            <div className='p-4 space-y-4'>
              {songWithComments?.comments.map(comment => (
                <div
                  key={comment._id}
                  className={`flex items-start gap-3 
                    ${userIsAuthor(comment.sender._id) ? 'flex-row-reverse' : ''}
                  `}
                >
                  <div className={`flex flex-col items-center text-center ${userIsAuthor(comment.sender._id) ? 'text-teal-700' : ''}`}>
                    <UserCircle2 className="size-8" />
                    <span className="text-sm">
                      {userIsAuthor(comment.sender._id) ? 'You' : comment.sender.username}
                    </span>  
                  </div>   
                  <div
                    className={`rounded-lg p-2 w-max[80%]
                      ${userIsAuthor(comment.sender._id) ? 'bg-teal-800' : 'bg-zinc-800'}
                    `}
                  >
                    <p className='text-sm'>{comment.message}</p>
                    <span className='text-xs text-zinc-300 mt-1 block'>
                      {new Date(comment.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        }
        {/* Comments input area */}
        <div className='mt-auto border-t border-zinc-800'>
          <CommentsInput />
		    </div>
      </div>   
    </main>
  )
}

export default CommentsPage